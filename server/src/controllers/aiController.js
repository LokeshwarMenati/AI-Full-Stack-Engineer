import { analyzeComplaint, calculateTextSimilarity, summarizeActionReport } from '../services/geminiService.js';
import { Grievance } from '../models/Grievance.js';

export const analyzeGrievanceAi = async (req, res, next) => {
  try {
    const { subject, description, district } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required for AI analysis'
      });
    }

    const analysis = await analyzeComplaint({
      subject,
      description,
      district: district || 'Thiruvananthapuram'
    });

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

export const checkDuplicates = async (req, res, next) => {
  try {
    const { text, district } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required for duplicate check' });
    }

    const query = {
      status: { $in: ['Submitted', 'Under Review', 'In Progress'] }
    };
    if (district) query.district = district;

    const existing = await Grievance.find(query).select('referenceNumber subject description district').limit(50).lean();

    const matches = [];
    for (const item of existing) {
      const score = calculateTextSimilarity(text, `${item.subject} ${item.description}`);
      if (score > 0.4) {
        matches.push({
          referenceNumber: item.referenceNumber,
          subject: item.subject,
          district: item.district,
          similarityScore: Math.round(score * 100) / 100
        });
      }
    }

    res.status(200).json({
      success: true,
      hasDuplicates: matches.length > 0,
      matches
    });
  } catch (error) {
    next(error);
  }
};

export const summarizeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required to summarize' });
    }

    const summary = await summarizeActionReport(text);
    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    next(error);
  }
};
