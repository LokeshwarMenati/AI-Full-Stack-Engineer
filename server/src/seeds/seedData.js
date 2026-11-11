import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Grievance } from '../models/Grievance.js';
import { GrievanceHistory } from '../models/GrievanceHistory.js';
import { CitizenFeedback } from '../models/CitizenFeedback.js';
import { DepartmentAssignment } from '../models/DepartmentAssignment.js';
import { KERALA_DISTRICTS, GRIEVANCE_STATUSES, PRIORITIES } from '../config/constants.js';

dotenv.config();

const SEED_DEPARTMENTS = [
  {
    code: 'PWD',
    name: 'Public Works Department',
    description: 'Responsible for public roadway, highway maintenance, bridges, and infrastructure construction.',
    categories: ['Road Repair & Potholes', 'Bridge Safety', 'Street Drainage', 'Government Building Maintenance'],
    headEmail: 'pwd.head@kerala.demo',
    contactPhone: '+91-471-2334001'
  },
  {
    code: 'HEALTH',
    name: 'Health Department',
    description: 'Oversees public healthcare centres, district hospitals, sanitation hygiene, and epidemic control.',
    categories: ['Hospital Sanitation', 'Medicine Availability', 'Primary Health Center Facilities', 'Doctor Attendance'],
    headEmail: 'health.head@kerala.demo',
    contactPhone: '+91-471-2334002'
  },
  {
    code: 'EDU',
    name: 'Education Department',
    description: 'Administers public school facilities, mid-day meals, academic safety, and campus infrastructure.',
    categories: ['School Infrastructure', 'Classroom Maintenance', 'Drinking Water in Schools', 'Staffing Inquiries'],
    headEmail: 'education.head@kerala.demo',
    contactPhone: '+91-471-2334003'
  },
  {
    code: 'WATER',
    name: 'Water Resources Department',
    description: 'Manages Kerala Water Authority pipelines, drinking water supply schemes, and irrigation canals.',
    categories: ['Water Supply Interruption', 'Pipeline Leakage', 'Water Quality & Contamination', 'Canal Maintenance'],
    headEmail: 'water.head@kerala.demo',
    contactPhone: '+91-471-2334004'
  },
  {
    code: 'LSGD',
    name: 'Local Self Government Department',
    description: 'Handles municipal corporations, grama panchayats, solid waste disposal, and local streetlights.',
    categories: ['Waste Management & Garbage', 'Streetlight Failures', 'Local Drainage Clogs', 'Trade License Issues'],
    headEmail: 'lsgd.head@kerala.demo',
    contactPhone: '+91-471-2334005'
  },
  {
    code: 'KSEB',
    name: 'Electricity Department',
    description: 'Powers state electrical grid transmission, hazardous line replacements, and transformer repairs.',
    categories: ['Power Supply Outage', 'Low Voltage Anomalies', 'Dangerous Overhead Wires', 'Transformer Maintenance'],
    headEmail: 'electricity.head@kerala.demo',
    contactPhone: '+91-471-2334006'
  },
  {
    code: 'TRANS',
    name: 'Transport Department',
    description: 'Supervises KSRTC bus routes, road transport safety, bus shelters, and vehicular licensing.',
    categories: ['Public Transit Services', 'Bus Route Irregularities', 'Bus Stand Cleanliness', 'Traffic Signage'],
    headEmail: 'transport.head@kerala.demo',
    contactPhone: '+91-471-2334007'
  },
  {
    code: 'REV',
    name: 'Revenue Department',
    description: 'Manages village offices, land records, survey demarcations, and statutory certifications.',
    categories: ['Land Records & Certificates', 'Pattayam Settlement', 'Encroachment Verification', 'Tax Assessment'],
    headEmail: 'revenue.head@kerala.demo',
    contactPhone: '+91-471-2334008'
  }
];

const COMPLAINT_TEMPLATES = [
  {
    deptCode: 'PWD',
    category: 'Road Repair & Potholes',
    subject: 'Dangerous deep potholes on main bypass road causing accidents',
    desc: 'Severe crater-like potholes have developed over the past 3 weeks near the junction. Two two-wheelers suffered skidding accidents yesterday. Immediate tarring and repair requested.'
  },
  {
    deptCode: 'WATER',
    category: 'Water Supply Interruption',
    subject: 'Complete drinking water pipeline shutdown for 5 consecutive days',
    desc: 'Over 120 residential households in our ward have had zero pipe water supply since Monday. Local pumping station reports pipeline rupture near the culvert. Emergency water tanker requested.'
  },
  {
    deptCode: 'HEALTH',
    category: 'Hospital Sanitation',
    subject: 'Unhygienic hospital ward conditions and overflowing waste bin at PHC',
    desc: 'The casualty waiting hall and outpatient restrooms at the primary health centre have not been sanitized for two days. Medical bio-waste is left unsealed, creating an infection hazard.'
  },
  {
    deptCode: 'EDU',
    category: 'School Infrastructure',
    subject: 'Damaged ceiling tiles and leaking roof in government UP school classroom',
    desc: 'Due to recent rains, the classroom roof is dripping continuously onto students desks. Plaster has detached in two corners, posing a safety danger to primary school children.'
  },
  {
    deptCode: 'LSGD',
    category: 'Streetlight Failures',
    subject: 'Entire stretch of 18 LED streetlights non-operational on colony road',
    desc: 'For the past three weeks, the colony link road is plunged in pitch darkness. Elderly residents and women returning from evening transit shifts face safety vulnerabilities.'
  },
  {
    deptCode: 'KSEB',
    category: 'Dangerous Overhead Wires',
    subject: 'Sagging high-tension electricity line touching tree branches',
    desc: 'A 415V secondary overhead power wire is hanging barely 7 feet above the residential road near the bus shelter. Sparks were observed during wind gusts.'
  },
  {
    deptCode: 'TRANS',
    category: 'Public Transit Services',
    subject: 'Irregular morning KSRTC bus service affecting school children and office goers',
    desc: 'The 8:15 AM schedule through the village has been cancelled without notice 4 days this week, leaving commuters and students stranded.'
  },
  {
    deptCode: 'LSGD',
    category: 'Waste Management & Garbage',
    subject: 'Illegal dumping of commercial plastic garbage on canal banks',
    desc: 'Multiple trucks have dumped commercial waste along the waterway embankment, contaminating drainage water and causing foul stench across the ward.'
  },
  {
    deptCode: 'REV',
    category: 'Land Records & Certificates',
    subject: 'Delay in land mutation and possession certificate issuance at Village Office',
    desc: 'Applied for property tax mutation 60 days ago under application token #48291. No inspection or status update provided despite three personal visits.'
  },
  {
    deptCode: 'PWD',
    category: 'Bridge Safety',
    subject: 'Corroded guard rails on aged canal bridge near market',
    desc: 'The protective concrete railing on the narrow bridge has collapsed on the eastern flank. Pedestrians risk plunging into the canal during dark hours.'
  }
];

export const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janaseva_ai';
  console.log(`[Seed] Connecting to MongoDB: ${uri}`);
  await mongoose.connect(uri);

  console.log('[Seed] Starting idempotent database seeding...');

  // 1. Seed Departments (upsert)
  const departmentDocs = {};
  for (const deptData of SEED_DEPARTMENTS) {
    const dept = await Department.findOneAndUpdate(
      { code: deptData.code },
      { $set: deptData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    departmentDocs[dept.code] = dept;
  }
  console.log(`[Seed] Seeded ${Object.keys(departmentDocs).length} departments.`);

  // 2. Seed Demo Accounts
  const citizenPassword = await bcrypt.hash('Citizen@123', 10);
  const cmoPassword = await bcrypt.hash('CMO@12345', 10);
  const officerPassword = await bcrypt.hash('Officer@123', 10);

  const demoCitizen = await User.findOneAndUpdate(
    { email: 'citizen@janaseva.demo' },
    {
      $set: {
        name: 'Arun Kumar V',
        email: 'citizen@janaseva.demo',
        mobileNumber: '+91-9847012345',
        password: citizenPassword,
        role: 'citizen',
        isDemoAccount: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const demoCmo = await User.findOneAndUpdate(
    { email: 'cmo@janaseva.demo' },
    {
      $set: {
        name: 'Chief Minister Secretariat Officer',
        email: 'cmo@janaseva.demo',
        mobileNumber: '+91-9447000001',
        password: cmoPassword,
        role: 'cmo_admin',
        designation: 'Joint Secretary to Chief Minister',
        isDemoAccount: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const pwdDept = departmentDocs['PWD'];
  const demoOfficer = await User.findOneAndUpdate(
    { email: 'officer@janaseva.demo' },
    {
      $set: {
        name: 'Suresh Menon (Assistant Executive Engineer)',
        email: 'officer@janaseva.demo',
        mobileNumber: '+91-9447111222',
        password: officerPassword,
        role: 'officer',
        department: pwdDept._id,
        designation: 'Assistant Executive Engineer (PWD Roads)',
        isDemoAccount: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('[Seed] Seeded Demo Accounts (Citizen, CMO Admin, Officer).');

  // 3. Seed approximately 100 Fictional Grievances across all districts and 5 statuses
  const statuses = [
    GRIEVANCE_STATUSES.SUBMITTED,
    GRIEVANCE_STATUSES.UNDER_REVIEW,
    GRIEVANCE_STATUSES.IN_PROGRESS,
    GRIEVANCE_STATUSES.RESOLVED,
    GRIEVANCE_STATUSES.REOPENED
  ];

  const existingCount = await Grievance.countDocuments();
  if (existingCount >= 100) {
    console.log(`[Seed] Database already has ${existingCount} grievances. Skipping grievance recreation for idempotency.`);
    await mongoose.disconnect();
    return;
  }

  // Clear existing demo grievances if partial
  await Grievance.deleteMany({ referenceNumber: { $regex: '^KGR-2026-' } });
  await GrievanceHistory.deleteMany({});
  await CitizenFeedback.deleteMany({});
  await DepartmentAssignment.deleteMany({});

  console.log('[Seed] Generating 100 realistic demonstration grievances...');

  const totalToSeed = 100;
  for (let i = 1; i <= totalToSeed; i++) {
    const seq = String(100000 + i);
    const referenceNumber = `KGR-2026-${seq}`;
    const tmpl = COMPLAINT_TEMPLATES[(i - 1) % COMPLAINT_TEMPLATES.length];
    const district = KERALA_DISTRICTS[(i - 1) % KERALA_DISTRICTS.length];
    const dept = departmentDocs[tmpl.deptCode] || pwdDept;
    const status = statuses[(i - 1) % statuses.length];
    const priority = PRIORITIES[(i - 1) % PRIORITIES.length];

    // Fictional creation date staggered across past 60 days
    const daysAgo = Math.floor((100 - i) * 0.6);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const deadline = new Date(createdAt);
    deadline.setHours(deadline.getHours() + (priority === 'Urgent' ? 24 : priority === 'High' ? 48 : 96));

    const isResolved = status === GRIEVANCE_STATUSES.RESOLVED;
    const isReopened = status === GRIEVANCE_STATUSES.REOPENED;

    const grievance = new Grievance({
      referenceNumber,
      citizen: demoCitizen._id,
      district,
      department: dept._id,
      category: tmpl.category,
      subject: `${tmpl.subject} - Ward ${((i * 3) % 25) + 1}, ${district}`,
      description: `${tmpl.desc} Detailed inspection requested by local residents. (Fictional Demo Record #${i})`,
      priority,
      status,
      assignedOfficer: [GRIEVANCE_STATUSES.IN_PROGRESS, GRIEVANCE_STATUSES.RESOLVED].includes(status) ? demoOfficer._id : null,
      slaDeadline: deadline,
      createdAt,
      aiAnalysis: {
        suggestedDepartment: dept.name,
        suggestedCategory: tmpl.category,
        priority,
        summary: `Citizen reports ${tmpl.category.toLowerCase()} in ${district}.`,
        reasoning: `Contextually matched to ${dept.name} based on civic safety impact.`,
        confidence: 0.92,
        duplicateWarning: false
      },
      cmoRemarks: [GRIEVANCE_STATUSES.UNDER_REVIEW, GRIEVANCE_STATUSES.IN_PROGRESS, GRIEVANCE_STATUSES.RESOLVED].includes(status)
        ? `Forwarded to ${dept.name} for immediate field enquiry.`
        : '',
      officerRemarks: [GRIEVANCE_STATUSES.IN_PROGRESS, GRIEVANCE_STATUSES.RESOLVED].includes(status)
        ? `Site inspected on ${new Date(createdAt.getTime() + 86400000).toDateString()}. Work estimate formulated.`
        : '',
      actionTakenReport: isResolved
        ? {
            summary: 'Field repair completed and verified by assistant engineer.',
            actionsDetails: 'Civil contractor dispatched; bitumen patch applied; water drainage channel cleared; site verified safe.',
            submittedAt: new Date(createdAt.getTime() + 172800000),
            submittedBy: demoOfficer._id,
            reviewedByCmo: true,
            cmoReviewNotes: 'Redressal approved based on engineer verification photograph.'
          }
        : {},
      resolutionDetails: isResolved
        ? {
            resolvedAt: new Date(createdAt.getTime() + 200000000),
            resolvedBy: demoCmo._id,
            notes: 'Redressal approved. Issue resolved to citizen satisfaction.'
          }
        : {},
      reopenedDetails: isReopened
        ? {
            reopenedAt: new Date(),
            reopenedBy: demoCitizen._id,
            reason: 'The temporary repair eroded after recent heavy rain. Permanent recarpeting required.'
          }
        : {}
    });

    await grievance.save();

    // 1. Initial history record
    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus: null,
      newStatus: GRIEVANCE_STATUSES.SUBMITTED,
      responsibleUser: demoCitizen._id,
      actionType: 'SUBMITTED',
      remarks: 'Citizen submitted grievance through portal.',
      createdAt
    });

    // 2. Progressive status histories
    if (status !== GRIEVANCE_STATUSES.SUBMITTED) {
      await GrievanceHistory.create({
        grievance: grievance._id,
        previousStatus: GRIEVANCE_STATUSES.SUBMITTED,
        newStatus: GRIEVANCE_STATUSES.UNDER_REVIEW,
        responsibleUser: demoCmo._id,
        actionType: 'DEPARTMENT_ASSIGNED',
        remarks: `Assigned to ${dept.name} by CMO administrative cell.`,
        createdAt: new Date(createdAt.getTime() + 43200000)
      });
    }

    if ([GRIEVANCE_STATUSES.IN_PROGRESS, GRIEVANCE_STATUSES.RESOLVED, GRIEVANCE_STATUSES.REOPENED].includes(status)) {
      await GrievanceHistory.create({
        grievance: grievance._id,
        previousStatus: GRIEVANCE_STATUSES.UNDER_REVIEW,
        newStatus: GRIEVANCE_STATUSES.IN_PROGRESS,
        responsibleUser: demoOfficer._id,
        actionType: 'INVESTIGATION_STARTED',
        remarks: 'Officer commenced field verification.',
        createdAt: new Date(createdAt.getTime() + 86400000)
      });
    }

    if (isResolved || isReopened) {
      await GrievanceHistory.create({
        grievance: grievance._id,
        previousStatus: GRIEVANCE_STATUSES.IN_PROGRESS,
        newStatus: GRIEVANCE_STATUSES.RESOLVED,
        responsibleUser: demoCmo._id,
        actionType: 'RESOLVED',
        remarks: 'CMO approved action-taken report. Grievance resolved.',
        createdAt: new Date(createdAt.getTime() + 200000000)
      });

      // Seed citizen feedback on some resolved grievances
      if (i % 2 === 0) {
        const feedback = await CitizenFeedback.create({
          grievance: grievance._id,
          citizen: demoCitizen._id,
          rating: 4 + (i % 2),
          feedbackText: 'The department responded promptly and repaired the issue within the promised timeframe. Good governance!',
          timelinessRating: 5,
          officerBehaviorRating: 5
        });
        grievance.hasFeedback = true;
        grievance.feedback = feedback._id;
        await grievance.save();
      }
    }

    if (isReopened) {
      await GrievanceHistory.create({
        grievance: grievance._id,
        previousStatus: GRIEVANCE_STATUSES.RESOLVED,
        newStatus: GRIEVANCE_STATUSES.REOPENED,
        responsibleUser: demoCitizen._id,
        actionType: 'REOPENED',
        remarks: 'Citizen reopened grievance: Waterlogging recurred after monsoon shower.',
        createdAt: new Date()
      });
    }
  }

  console.log('[Seed] Successfully seeded 100 fictional demonstration grievances with full audit history.');
  await mongoose.disconnect();
  console.log('[Seed] Database connection closed. Seeding complete!');
};

// If run directly via CLI
if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase().catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
  });
}
