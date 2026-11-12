# JANASEVA AI – Intelligent Public Grievance & Governance Platform
> **Tagline:** *"Every Voice Matters. Every Grievance Deserves Action."*  
> **Inspired by:** CM Kerala – Chief Minister's Public Grievance Redressal Portal  
> **Candidate Assessment Submission:** WhiteMatrix Software Solutions Machine Test Evaluation

---

## 🏛️ Recruitment Prototype Disclaimer
**IMPORTANT:** This platform is a recruitment evaluation prototype. It is a fictional demonstration and is not affiliated with, endorsed by, or sponsored by the Government of Kerala or the Chief Minister's Office. All names, designations, complaints, and contact numbers used in demonstration data are fictional.

---

## 🚀 Key Platform Capabilities
- **Mandatory Pure JavaScript Stack:** 100% JavaScript (`.js`, `.jsx`). Zero TypeScript (`.ts`/`.tsx`) files across both client and server.
- **Three Dedicated Portals:**
  - **Citizen Portal:** Grievance filing with AI pre-submission analysis, public/private tracking, 5-star feedback rating, and grievance reopening.
  - **CMO Command Center:** Real-time MongoDB aggregation KPI metrics, district/department charts (Recharts), department routing, overdue escalations, and Action-Taken Report reviews.
  - **Department Officer Workspace:** Department-scoped caseload, field investigation logs, and ATR submission.
- **Google Gemini AI Integration:** Live semantic categorization, priority assessment, duplicate detection, and action-taken report summarization with human-in-the-loop safeguards.
- **Mandatory Dual-Layer CAPTCHA:** Every login and registration is protected by both Cloudflare Turnstile and server-generated Image CAPTCHA (`svg-captcha`).
- **Complete Grievance Lifecycle:** All 5 mandatory statuses implemented (`Submitted` → `Under Review` → `In Progress` → `Resolved` → `Reopened`) with immutable history chains.
- **100 Realistic Demonstration Records:** Comprehensive idempotent seed script covering all 14 Kerala districts and 8 nodal departments.
- **Bilingual Accessibility:** Instant English & Malayalam (മലയാളം) language switching with WCAG 2.2 AA compliant contrast.
- **Interactive Swagger Documentation:** Built-in OpenAPI specification accessible at `/api/docs`.
- **100% Verified Automated Test Suite:** 17/17 Jest & Supertest integration tests passing.

---

## 🔑 Demo Evaluation Credentials

| Persona | Email | Password | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@janaseva.demo` | `Citizen@123` | File, track, rate, and reopen grievances |
| **CMO Admin** | `cmo@janaseva.demo` | `CMO@12345` | Ministerial command, assignments, ATR review |
| **Department Officer** | `officer@janaseva.demo` | `Officer@123` | PWD Nodal Officer, investigations, ATR submission |

*Tip: The login page includes 1-click quick fill buttons for each persona.*

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Recharts, Lucide React, Canvas Confetti.
- **Backend:** Node.js v24, Express.js (ES Modules), Socket.IO, Zod, Multer, Helmet, Express Rate Limit, SVG Captcha.
- **Database:** MongoDB Community Server / MongoDB Atlas, Mongoose ODM with aggregation pipelines.
- **AI Intelligence:** Google Gemini (`@google/generative-ai`), cosine similarity duplicate detection.
- **Testing:** Jest, Supertest, Playwright.

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- Node.js (v18, v20, or v24)
- MongoDB running locally on port 27017 or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Demonstration Data (Idempotent)
```bash
npm run seed
```

### 4. Run Development Servers
```bash
npm run dev
```
- **Live Production Application:** [https://client-two-blue-90.vercel.app](https://client-two-blue-90.vercel.app)
- **Public Interactive Swagger OpenAPI Docs:** [https://client-two-blue-90.vercel.app/api-docs](https://client-two-blue-90.vercel.app/api-docs)
- **Frontend Development Application:** [http://localhost:3000](http://localhost:3000)
- **Backend Development API Server:** [http://localhost:5000](http://localhost:5000)
- **Local Swagger API Docs:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 5. Run Automated Tests
```bash
npm run test
```
Executes all 17 integration tests across authentication, dual CAPTCHA, RBAC, grievance lifecycles, and AI fallbacks.

### 6. Run Production Build
```bash
npm run build
```

---

## 📁 Required Documentation Structure
Detailed documentation is organized in the `DOCUMENTATION/` directory:
- [01. Project Overview](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/01_Project_Overview.md)
- [02. System Architecture](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/02_System_Architecture.md)
- [03. Database Design](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/03_Database_Design.md)
- [04. API Documentation](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/04_API_Documentation.md)
- [05. AI Integration & Safeguards](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/05_AI_Integration.md)
- [06. Setup and Testing Guide](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/06_Setup_and_Testing.md)
- [07. User Guide](file:///e:/AI%20Full%20Stack%20Engineer/DOCUMENTATION/07_User_Guide.md)

---

## ⚖️ License
Fictional demonstration platform developed for evaluation purposes.

