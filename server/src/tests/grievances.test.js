import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../index.js';
import { User } from '../models/User.js';
import { Grievance } from '../models/Grievance.js';
import { GrievanceHistory } from '../models/GrievanceHistory.js';
import { generateReferenceNumber } from '../services/referenceIdService.js';
import { GRIEVANCE_STATUSES } from '../config/constants.js';

let citizenToken = '';
let cmoToken = '';
let citizenUser = null;
let cmoUser = null;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janaseva_ai');
  }

  citizenUser = await User.findOne({ email: 'citizen@janaseva.demo' });
  cmoUser = await User.findOne({ email: 'cmo@janaseva.demo' });

  citizenToken = jwt.sign(
    { id: citizenUser._id },
    process.env.JWT_SECRET || 'janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala'
  );
  cmoToken = jwt.sign(
    { id: cmoUser._id },
    process.env.JWT_SECRET || 'janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala'
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Grievance Lifecycle and Workflow Tests', () => {
  let createdRef = '';
  let createdId = '';

  test('generateReferenceNumber should produce unique KGR-YYYY-NNNNNN format', async () => {
    const ref1 = await generateReferenceNumber();
    expect(ref1).toMatch(/^KGR-2026-\d{6}$/);
  });

  test('POST /api/grievances should submit complaint and create immutable initial history', async () => {
    const res = await request(app)
      .post('/api/grievances')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        district: 'Ernakulam',
        category: 'Road Repair & Potholes',
        subject: 'Deep pothole near Marine Drive walkway',
        description: 'Large pothole posing a danger to pedestrians and morning joggers.',
        priority: 'High'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.grievance.referenceNumber).toMatch(/^KGR-2026-\d{6}$/);
    expect(res.body.grievance.status).toBe(GRIEVANCE_STATUSES.SUBMITTED);

    createdRef = res.body.grievance.referenceNumber;
    createdId = res.body.grievance._id;

    // Verify history was recorded
    const history = await GrievanceHistory.find({ grievance: createdId });
    expect(history.length).toBe(1);
    expect(history[0].actionType).toBe('SUBMITTED');
    expect(history[0].newStatus).toBe(GRIEVANCE_STATUSES.SUBMITTED);
  });

  test('GET /api/grievances/track/:ref should mask citizen personal data for anonymous user', async () => {
    const res = await request(app).get(`/api/grievances/track/${createdRef}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.trackingData.referenceNumber).toBe(createdRef);
    // Personal information must be masked
    expect(res.body.trackingData.citizen.email).toBe('***@***.***');
  });

  test('PATCH /api/grievances/:id/status should reject invalid transitions', async () => {
    // Attempting to move from 'Submitted' directly to 'Resolved' violates transition rules
    const res = await request(app)
      .patch(`/api/grievances/${createdId}/status`)
      .set('Authorization', `Bearer ${cmoToken}`)
      .send({
        newStatus: GRIEVANCE_STATUSES.RESOLVED,
        remarks: 'Trying to skip review and progress'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid status transition');
  });

  test('Permitted status transitions should work and maintain immutable history chain', async () => {
    // 1. Move from Submitted -> Under Review
    const res1 = await request(app)
      .patch(`/api/grievances/${createdId}/status`)
      .set('Authorization', `Bearer ${cmoToken}`)
      .send({
        newStatus: GRIEVANCE_STATUSES.UNDER_REVIEW,
        remarks: 'CMO cell initial screening completed.'
      });
    expect(res1.status).toBe(200);

    // 2. Move from Under Review -> In Progress
    const res2 = await request(app)
      .patch(`/api/grievances/${createdId}/status`)
      .set('Authorization', `Bearer ${cmoToken}`)
      .send({
        newStatus: GRIEVANCE_STATUSES.IN_PROGRESS,
        remarks: 'Assigned to field executive.'
      });
    expect(res2.status).toBe(200);

    // 3. Move from In Progress -> Resolved (by CMO)
    const res3 = await request(app)
      .patch(`/api/grievances/${createdId}/status`)
      .set('Authorization', `Bearer ${cmoToken}`)
      .send({
        newStatus: GRIEVANCE_STATUSES.RESOLVED,
        remarks: 'Pothole filled with asphalt. Redressal approved.'
      });
    expect(res3.status).toBe(200);

    // 4. Citizen can reopen resolved grievance
    const res4 = await request(app)
      .post(`/api/grievances/${createdId}/reopen`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        reason: 'The pothole was only filled with mud, which washed away after rain.'
      });
    expect(res4.status).toBe(200);
    expect(res4.body.grievance.status).toBe(GRIEVANCE_STATUSES.REOPENED);

    // Check history count: initial submitted + 3 transitions + reopened = 5 records
    const fullHistory = await GrievanceHistory.find({ grievance: createdId });
    expect(fullHistory.length).toBe(5);
  });
});

