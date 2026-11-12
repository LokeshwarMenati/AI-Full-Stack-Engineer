import { GoogleGenerativeAI } from '@google/generative-ai';
import { Department } from '../models/Department.js';
import { Grievance } from '../models/Grievance.js';
import { AIAnalysis } from '../models/AIAnalysis.js';

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    console.warn('[Gemini] Failed to initialize GoogleGenerativeAI instance:', e.message);
  }
}

/**
 * Strips identifiable personal info (phone numbers, email addresses, aadhar patterns)
 * before passing to LLM to preserve citizen privacy.
 */
export const sanitizeComplaintText = (text = '') => {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(\+91[\-\s]?)?[6789]\d{9}/g, '[REDACTED_PHONE]')
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_ID]');
};

/**
 * Calculates cosine or word-overlap similarity for duplicate detection
 */
export const calculateTextSimilarity = (str1, str2) => {
  const getTokens = (s) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

  const tokens1 = getTokens(str1);
  const tokens2 = getTokens(str2);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersection = 0;
  for (const token of tokens1) {
    if (tokens2.has(token)) intersection++;
  }

  const union = new Set([...tokens1, ...tokens2]).size;
  return union > 0 ? intersection / union : 0;
};

/**
 * Analyzes citizen grievance input using Google Gemini API or intelligent verified fallback
 */
export const analyzeComplaint = async ({ subject, description, district, grievanceId = null }) => {
  const sanitizedInput = sanitizeComplaintText(`${subject}. ${description}`);

  // Fetch valid active departments from DB to enforce strict schema adherence
  const departments = await Department.find({ isActive: true }).lean();
  const departmentNames = departments.map((d) => d.name);
  const categoryMap = {};
  departments.forEach((d) => {
    categoryMap[d.name] = d.categories || [];
  });

  // Check for potential duplicate complaints in the same district or category
  const recentComplaints = await Grievance.find({
    district,
    status: { $in: ['Submitted', 'Under Review', 'In Progress'] }
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .select('referenceNumber subject description district')
    .lean();

  const similarMatches = [];
  for (const item of recentComplaints) {
    const sim = calculateTextSimilarity(item.description, description);
    if (sim > 0.45) {
      similarMatches.push({
        referenceNumber: item.referenceNumber,
        similarityScore: Math.round(sim * 100) / 100,
        subject: item.subject
      });
    }
  }

  let aiResult = null;
  let modelNameUsed = 'rule-contextual-v1';

  if (genAI && process.env.GEMINI_API_KEY) {
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    for (const m of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: m,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });

        const prompt = `You are the Official AI Grievance Classification Engine for JANASEVA AI (Government of Kerala Public Grievance Redressal Portal prototype).
Analyze this citizen grievance and return a JSON object.

Valid Departments:
${JSON.stringify(departmentNames, null, 2)}

Valid Categories by Department:
${JSON.stringify(categoryMap, null, 2)}

Grievance Details:
Subject: ${subject}
District: ${district}
Complaint: ${sanitizedInput}

REQUIRED JSON OUTPUT FORMAT:
{
  "suggestedDepartment": "One department matching exact name from the valid list",
  "suggestedCategory": "One category matching or relevant to the department",
  "priority": "Low" | "Medium" | "High" | "Urgent",
  "summary": "1 to 2 sentence executive summary of the issue",
  "reasoning": "Clear factual reason for department and priority rating",
  "confidence": 0.85 to 0.99
}`;

        const response = await model.generateContent(prompt);
        const rawText = response.response.text();
        aiResult = JSON.parse(rawText);
        if (aiResult?.suggestedDepartment) {
          modelNameUsed = `Google Gemini (${m})`;
          break;
        }
      } catch (err) {
        console.warn(`[Gemini API] Model ${m} attempt failed (${err.message}). Trying next candidate.`);
      }
    }
  }

  // If Gemini API was unavailable or returned invalid schema, run contextual rule matching
  if (!aiResult || !aiResult.suggestedDepartment) {
    aiResult = fallbackAnalyze(subject, description, departments);
    modelNameUsed = 'Local Heuristic Fallback Classifier';
  }

  // Safety safeguard: Verify suggested department strictly exists in the database
  const matchedDept = departments.find(
    (d) => d.name.toLowerCase() === (aiResult.suggestedDepartment || '').toLowerCase()
  );

  const finalDepartment = matchedDept ? matchedDept.name : (departments[0]?.name || 'Local Self Government Department');
  const validCategories = categoryMap[finalDepartment] || ['General Grievance'];
  const finalCategory = validCategories.find(
    (c) => c.toLowerCase() === (aiResult.suggestedCategory || '').toLowerCase()
  ) || validCategories[0] || 'General Public Grievance';

  const finalOutput = {
    suggestedDepartment: finalDepartment,
    suggestedCategory: finalCategory,
    priority: ['Low', 'Medium', 'High', 'Urgent'].includes(aiResult.priority) ? aiResult.priority : 'Medium',
    summary: aiResult.summary || `${subject}: Investigation recommended for redressing citizen concerns.`,
    reasoning: aiResult.reasoning || `Classified under ${finalDepartment} based on subject context and reported civic impact.`,
    confidence: typeof aiResult.confidence === 'number' ? Math.min(Math.max(aiResult.confidence, 0.5), 0.99) : 0.88,
    duplicateWarning: similarMatches.length > 0,
    similarReferenceIds: similarMatches.map((m) => m.referenceNumber),
    source: modelNameUsed
  };

  // Persist AI analysis log
  try {
    await AIAnalysis.create({
      grievance: grievanceId,
      inputText: sanitizedInput.substring(0, 500),
      suggestedDepartment: finalOutput.suggestedDepartment,
      suggestedCategory: finalOutput.suggestedCategory,
      priority: finalOutput.priority,
      summary: finalOutput.summary,
      reasoning: finalOutput.reasoning,
      confidence: finalOutput.confidence,
      duplicateWarning: finalOutput.duplicateWarning,
      similarGrievances: similarMatches,
      modelUsed: modelNameUsed
    });
  } catch (e) {
    console.error('[AIAnalysis] Failed to save AI analysis record:', e.message);
  }

  return finalOutput;
};

/**
 * Intelligent contextual fallback engine
 */
const fallbackAnalyze = (subject, description, departments) => {
  const text = `${subject} ${description}`.toLowerCase();

  let selectedDept = 'Local Self Government Department';
  let category = 'Public Infrastructure';
  let priority = 'Medium';
  let reasoning = 'Assigned to local administrative authorities for field verification.';

  if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drinking water') || text.includes('tap')) {
    selectedDept = 'Water Resources Department';
    category = 'Water Supply Interruption';
    priority = text.includes('severe') || text.includes('days') || text.includes('contaminated') ? 'High' : 'Medium';
    reasoning = 'Pertains to municipal water distribution, pipeline maintenance, or supply quality.';
  } else if (text.includes('road') || text.includes('pothole') || text.includes('bridge') || text.includes('tarring') || text.includes('highway')) {
    selectedDept = 'Public Works Department';
    category = 'Road Repair & Potholes';
    priority = text.includes('accident') || text.includes('danger') || text.includes('broken') ? 'High' : 'Medium';
    reasoning = 'Issue directly involves public roadway safety and infrastructure restoration.';
  } else if (text.includes('electric') || text.includes('kseb') || text.includes('power cut') || text.includes('transformer') || text.includes('wire')) {
    selectedDept = 'Electricity Department';
    category = 'Power Supply Outage';
    priority = text.includes('spark') || text.includes('fire') || text.includes('live wire') ? 'Urgent' : 'High';
    reasoning = 'Related to electrical grid stability, voltage anomalies, or hazardous overhead cables.';
  } else if (text.includes('hospital') || text.includes('doctor') || text.includes('medicine') || text.includes('phc') || text.includes('clinic')) {
    selectedDept = 'Health Department';
    category = 'Primary Health Center Facilities';
    priority = 'High';
    reasoning = 'Concerns public healthcare facilities, medical services, or sanitary provisions.';
  } else if (text.includes('school') || text.includes('teacher') || text.includes('student') || text.includes('classroom')) {
    selectedDept = 'Education Department';
    category = 'School Infrastructure';
    priority = 'Medium';
    reasoning = 'Relates to educational facility amenities or academic administration.';
  } else if (text.includes('bus') || text.includes('ksrtc') || text.includes('transport') || text.includes('traffic') || text.includes('license')) {
    selectedDept = 'Transport Department';
    category = 'Public Transit Services';
    priority = 'Medium';
    reasoning = 'Appertains to state transport operations, commuter schedules, or vehicle regulation.';
  } else if (text.includes('land') || text.includes('patta') || text.includes('tax') || text.includes('survey') || text.includes('village office')) {
    selectedDept = 'Revenue Department';
    category = 'Land Records & Certificates';
    priority = 'Medium';
    reasoning = 'Involves revenue records, certificate issuance, or village office governance.';
  }

  // Ensure department is among available
  const match = departments.find((d) => d.name === selectedDept);
  if (!match && departments.length > 0) {
    selectedDept = departments[0].name;
    category = departments[0].categories[0] || 'General';
  }

  return {
    suggestedDepartment: selectedDept,
    suggestedCategory: category,
    priority,
    summary: `${subject.substring(0, 100)} - Redressal requested for reported citizen inconvenience.`,
    reasoning,
    confidence: 0.91
  };
};

/**
 * Summarizes an officer's Action-Taken Report for CMO fast review
 */
export const summarizeActionReport = async (reportText) => {
  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const res = await model.generateContent(
        `Summarize this government grievance action-taken report in 2 crisp bullet points for executive approval:\n${reportText}`
      );
      return res.response.text();
    } catch (e) {
      console.warn('[Gemini] Summarize failed, using local extraction');
    }
  }

  const sentences = reportText.split('.').filter((s) => s.trim().length > 10);
  return sentences.slice(0, 2).join('. ') + '.';
};

