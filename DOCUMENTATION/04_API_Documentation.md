# 04. API Documentation – JANASEVA AI

## 1. Overview & Base URL
The backend exposes a RESTful JSON API adhering to strict HTTP semantics, role-based authorization headers, and structured error envelopes.

- **Base URL:** `http://localhost:5000/api`
- **Interactive Swagger Documentation:** Available at `http://localhost:5000/api/docs`
- **Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`

---

## 2. API Endpoints Catalog

### A. Authentication & Session
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Registers a citizen with dual-layer CAPTCHA verification |
| `POST` | `/auth/login` | Public | Authenticates citizen, CMO, or Officer with dual CAPTCHA |
| `POST` | `/auth/logout` | Authenticated | Invalidates session and logs audit trail |
| `GET` | `/auth/me` | Authenticated | Returns currently authenticated user details & department |

**Sample Login Request:**
```json
{
  "email": "citizen@janaseva.demo",
  "password": "Citizen@123",
  "turnstileToken": "TEST_PASS_TOKEN",
  "captchaId": "c394c8b2-4d7a-4a21-93bf-4d89a74c93ef",
  "captchaAnswer": "7K8D2"
}
```

---

### B. Dual CAPTCHA Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/captcha/image` | Public | Generates a 5-character SVG challenge with a 3-minute TTL |
| `POST` | `/captcha/verify` | Public | Validates image CAPTCHA token (single-use) |

---

### C. Grievances Lifecycle
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/grievances` | Citizen | Submits grievance; triggers Gemini AI classification |
| `GET` | `/grievances` | Role-Scoped | Lists grievances (Citizen views own, Officer views dept, CMO views all) |
| `GET` | `/grievances/:id` | Authenticated | Full complaint details with role access check |
| `GET` | `/grievances/track/:referenceNumber` | Public | Tracks grievance progress with citizen privacy masking |
| `PATCH` | `/grievances/:id/status` | CMO / Officer | Validates transition rules and appends history |
| `POST` | `/grievances/:id/reopen` | Citizen Owner | Reopens a resolved grievance with written justification |

**Sample Tracking Response (Public Privacy Masked):**
```json
{
  "success": true,
  "trackingData": {
    "referenceNumber": "KGR-2026-100001",
    "subject": "Dangerous deep potholes on main bypass road causing accidents",
    "district": "Ernakulam",
    "category": "Road Repair & Potholes",
    "status": "In Progress",
    "department": "Public Works Department",
    "submissionDate": "2026-11-01T10:15:00.000Z",
    "citizen": {
      "name": "A***",
      "email": "***@***.***"
    },
    "timeline": [
      {
        "newStatus": "Submitted",
        "actionType": "SUBMITTED",
        "remarks": "Citizen submitted grievance through portal.",
        "createdAt": "2026-11-01T10:15:00.000Z"
      },
      {
        "newStatus": "Under Review",
        "actionType": "DEPARTMENT_ASSIGNED",
        "remarks": "Assigned to Public Works Department by CMO.",
        "createdAt": "2026-11-01T14:30:00.000Z"
      }
    ]
  }
}
```

---

### D. CMO Command Center Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/cmo/statistics` | CMO Admin | Aggregated metrics, district breakdowns, and monthly trends |
| `GET` | `/cmo/grievances` | CMO Admin | Paginated state-wide grievance register with multi-filters |
| `POST` | `/cmo/assign` | CMO Admin | Assigns nodal department and designated officer |
| `POST` | `/cmo/escalate` | CMO Admin | Sets grievance priority to Urgent and alerts department |
| `POST` | `/cmo/review-report` | CMO Admin | Approves or rejects Action-Taken Report |

---

### E. Department Officer Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/officer/assigned` | Officer | Retrieves grievances assigned to officer's department |
| `POST` | `/officer/investigation` | Officer | Records site inspection notes and transitions status |
| `POST` | `/officer/action-report` | Officer | Files Action-Taken Report with proof of redressal |

---

### F. AI Grievance Assistant Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai/analyze` | Public / Auth | Evaluates draft complaint via Google Gemini LLM |
| `POST` | `/ai/duplicate-check` | Public / Auth | Calculates cosine similarity against active complaints |
| `POST` | `/ai/summarize` | Authenticated | Summarizes officer report into executive abstract |

---

### G. Feedback, Contact & Notifications
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/feedback` | Citizen Owner | Submits 1-5 star ratings for resolved grievances |
| `POST` | `/contact` | Public | Submits citizen support enquiries to MongoDB |
| `GET` | `/departments` | Public | Lists active government departments and categories |
| `GET` | `/notifications` | Authenticated | Retrieves user's unread notifications |
| `PATCH` | `/notifications/read-all`| Authenticated | Marks all notifications as read |
