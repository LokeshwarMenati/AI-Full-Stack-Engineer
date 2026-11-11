import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { Department } from '../models/Department.js';
import { sanitizeComplaintText } from '../services/geminiService.js';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janaseva_ai');
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('AI Grievance Assistant & Fallback Engine Tests', () => {
  test('sanitizeComplaintText should redact phone numbers, emails, and ID patterns', () => {
    const raw = 'Please contact me at citizen.test@kerala.gov or call 9847123456 regarding ID 1234 5678 9012.';
    const sanitized = sanitizeComplaintText(raw);

    expect(sanitized).not.toContain('citizen.test@kerala.gov');
    expect(sanitized).not.toContain('9847123456');
    expect(sanitized).toContain('[REDACTED_EMAIL]');
    expect(sanitized).toContain('[REDACTED_PHONE]');
  });

  test('POST /api/ai/analyze should return valid structured recommendation matching DB department', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({
        subject: 'Drinking water pipe burst flooding road',
        description: 'The main KWA pipeline ruptured opposite municipal park. Gallons of water wasting for 2 days.',
        district: 'Thiruvananthapuram'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis).toBeDefined();
    expect(res.body.analysis.suggestedDepartment).toBe('Water Resources Department');
    expect(res.body.analysis.priority).toBeDefined();
    expect(res.body.analysis.confidence).toBeGreaterThan(0.5);

    // Verify suggested department actually exists in DB
    const deptExists = await Department.findOne({ name: res.body.analysis.suggestedDepartment });
    expect(deptExists).not.toBeNull();
  });

  test('POST /api/ai/duplicate-check should detect semantically similar complaints', async () => {
    const res = await request(app)
      .post('/api/ai/duplicate-check')
      .send({
        text: 'Dangerous deep potholes on main road causing skidding accidents near junction',
        district: 'Thiruvananthapuram'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.matches)).toBe(true);
  });
});

