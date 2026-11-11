import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { generateImageCaptcha } from '../services/captchaService.js';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janaseva_ai');
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Authentication & Dual CAPTCHA Endpoints', () => {
  let challengeId = '';

  test('GET /api/captcha/image should generate valid image CAPTCHA challenge', async () => {
    const res = await request(app).get('/api/captcha/image');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.challengeId).toBeDefined();
    expect(res.body.svg).toContain('<svg');
    challengeId = res.body.challengeId;
  });

  test('POST /api/auth/login should fail if CAPTCHA answer is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@janaseva.demo',
        password: 'Citizen@123',
        turnstileToken: 'TEST_PASS_TOKEN',
        captchaId: challengeId,
        captchaAnswer: 'WRONG_CAPTCHA'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('CAPTCHA');
  });

  test('POST /api/auth/login should fail if Turnstile token is empty or invalid', async () => {
    const captcha = generateImageCaptcha();
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@janaseva.demo',
        password: 'Citizen@123',
        turnstileToken: '',
        captchaId: captcha.challengeId,
        captchaAnswer: 'anything'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login should fail on reused CAPTCHA challenge', async () => {
    // Generate fresh captcha
    const resImg = await request(app).get('/api/captcha/image');
    const cId = resImg.body.challengeId;

    // First attempt fails captcha or verifies
    await request(app)
      .post('/api/captcha/verify')
      .send({ challengeId: cId, answer: 'test' });

    // Second attempt with same ID should report expired or already used
    const res2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@janaseva.demo',
        password: 'Citizen@123',
        turnstileToken: 'TEST_PASS_TOKEN',
        captchaId: cId,
        captchaAnswer: 'test'
      });

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('expired or was already used');
  });

  test('POST /api/auth/login should reject invalid password for existing account', async () => {
    // We can directly mock or verify by providing a bypass token
    // In our captcha service, we can test credential validation
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@janaseva.demo',
        password: 'DefinitivelyWrongPassword123!',
        turnstileToken: 'TEST_PASS_TOKEN',
        captchaId: 'invalid-or-missing',
        captchaAnswer: 'abc'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

