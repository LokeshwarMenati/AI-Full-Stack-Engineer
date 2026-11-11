import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../index.js';
import { User } from '../models/User.js';
import { Grievance } from '../models/Grievance.js';

let citizenToken = '';
let officerToken = '';
let citizenUser = null;
let officerUser = null;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janaseva_ai');
  }

  citizenUser = await User.findOne({ email: 'citizen@janaseva.demo' });
  officerUser = await User.findOne({ email: 'officer@janaseva.demo' });

  citizenToken = jwt.sign(
    { id: citizenUser._id },
    process.env.JWT_SECRET || 'janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala'
  );
  officerToken = jwt.sign(
    { id: officerUser._id },
    process.env.JWT_SECRET || 'janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala'
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Role-Based Access Control (RBAC) & Security Tests', () => {
  test('Citizen should be forbidden (403) from accessing CMO statistics', async () => {
    const res = await request(app)
      .get('/api/cmo/statistics')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('Citizen should be forbidden (403) from assigning departments', async () => {
    const res = await request(app)
      .post('/api/cmo/assign')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        grievanceId: '60c72b2f9b1d8b2bad5e0123',
        departmentId: '60c72b2f9b1d8b2bad5e0124'
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('Unauthenticated request to protected route should return 401', async () => {
    const res = await request(app).get('/api/grievances');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Citizen cannot view full private details of a grievance owned by someone else', async () => {
    // Create dummy citizen 2 and dummy grievance
    const dummyUser = await User.findOneAndUpdate(
      { email: 'othercitizen@janaseva.demo' },
      {
        name: 'Other Citizen',
        email: 'othercitizen@janaseva.demo',
        password: 'Password@123',
        role: 'citizen'
      },
      { upsert: true, new: true }
    );

    const privateGrievance = await Grievance.create({
      referenceNumber: 'KGR-2026-999999',
      citizen: dummyUser._id,
      district: 'Kozhikode',
      category: 'Hospital Sanitation',
      subject: 'Private confidential complaint',
      description: 'Confidential personal data',
      status: 'Submitted'
    });

    // Try accessing with citizenToken (which belongs to Arun Kumar, not dummyUser)
    const res = await request(app)
      .get(`/api/grievances/${privateGrievance._id}`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Unauthorized');

    // Clean up
    await Grievance.deleteOne({ _id: privateGrievance._id });
    await User.deleteOne({ _id: dummyUser._id });
  });
});
