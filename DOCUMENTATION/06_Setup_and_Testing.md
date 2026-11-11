# 06. Setup and Testing Guide – JANASEVA AI

## 1. Prerequisites
- **Node.js:** v18.x or v20.x or v24.x (Tested on v24.15.0)
- **Package Manager:** `npm` (v10+ or v11+)
- **Database:** MongoDB Community Server (v6.0+ or v7.0+) running locally on port 27017 or a MongoDB Atlas connection string.

---

## 2. Environment Configuration
The project is configured out-of-the-box with development test defaults for local evaluation.

### Server Environment (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/janaseva_ai
JWT_SECRET=janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala
JWT_EXPIRES_IN=7d
CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
GEMINI_API_KEY=your_gemini_api_key_here
```

### Client Environment (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

---

## 3. Installation & Seeding
From the root workspace directory, run:

```bash
# 1. Install all dependencies across workspaces
npm install

# 2. Seed database with 100 fictional grievances, departments, and demo accounts
npm run seed
```

**Seed Verification:**
The seed script is idempotent and can be run multiple times safely. It seeds:
- 8 Nodal Departments
- 3 Demo Accounts (Citizen, CMO, Officer)
- 100 Fictional Grievances across all 14 districts and 5 statuses with complete audit histories.

---

## 4. Running the Application

### Development Mode (Both Frontend & Backend concurrently):
```bash
npm run dev
```

Alternatively, run in separate terminals:
```bash
# Terminal 1: Backend Express Server
npm run dev:server
# Server starts at: http://localhost:5000
# Swagger docs at: http://localhost:5000/api/docs

# Terminal 2: Frontend Next.js Application
npm run dev:client
# Application opens at: http://localhost:3000
```

---

## 5. Automated Testing

### A. Jest & Supertest Backend Test Suite
The backend contains automated integration tests covering Authentication, Dual CAPTCHA, RBAC, Status Transitions, and AI Fallbacks:

```bash
npm run test
```

**Actual Verified Test Output:**
```
PASS src/tests/grievances.test.js
  Grievance Lifecycle and Workflow Tests
    ✓ generateReferenceNumber should produce unique KGR-YYYY-NNNNNN format
    ✓ POST /api/grievances should submit complaint and create immutable initial history
    ✓ GET /api/grievances/track/:ref should mask citizen personal data for anonymous user
    ✓ PATCH /api/grievances/:id/status should reject invalid transitions
    ✓ Permitted status transitions should work and maintain immutable history chain

PASS src/tests/ai.test.js
  AI Grievance Assistant & Fallback Engine Tests
    ✓ sanitizeComplaintText should redact phone numbers, emails, and ID patterns
    ✓ POST /api/ai/analyze should return valid structured recommendation matching DB department
    ✓ POST /api/ai/duplicate-check should detect semantically similar complaints

PASS src/tests/authorization.test.js
  Role-Based Access Control (RBAC) & Security Tests
    ✓ Citizen should be forbidden (403) from accessing CMO statistics
    ✓ Citizen should be forbidden (403) from assigning departments
    ✓ Unauthenticated request to protected route should return 401
    ✓ Citizen cannot view full private details of a grievance owned by someone else

PASS src/tests/auth.test.js
  Authentication & Dual CAPTCHA Endpoints
    ✓ GET /api/captcha/image should generate valid image CAPTCHA challenge
    ✓ POST /api/auth/login should fail if CAPTCHA answer is incorrect
    ✓ POST /api/auth/login should fail if Turnstile token is empty or invalid
    ✓ POST /api/auth/login should fail on reused CAPTCHA challenge
    ✓ POST /api/auth/login should reject invalid password for existing account

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
```

### B. Production Build Verification
To verify the Next.js production build:
```bash
npm run build
```
Builds all 15 routes cleanly into optimized static assets.
