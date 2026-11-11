# 07. User Guide – JANASEVA AI

## 1. Quick Evaluation Credentials
For evaluators, the login page features **1-Click Quick Fill** buttons that automatically populate credentials:

| Persona | Email | Password | Role & Clearance |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@janaseva.demo` | `Citizen@123` | Grievance submission, tracking, feedback & reopening |
| **CMO Admin** | `cmo@janaseva.demo` | `CMO@12345` | Ministerial Command Center, assignments, ATR approvals, escalations |
| **Department Officer** | `officer@janaseva.demo` | `Officer@123` | PWD Nodal Officer, site investigation, ATR submission |

---

## 2. Citizen User Journey

### A. Submitting a New Grievance
1. Click **"Submit Grievance"** on the navigation bar or home banner.
2. Select your **District** from Kerala's 14 revenue districts.
3. Enter a clear **Subject** (e.g., *"Drinking water pipe burst near market culvert"*).
4. Enter the **Detailed Description**.
5. Click **"Analyze with Gemini AI"**:
   - The AI will evaluate the context and recommend the department (`Water Resources Department`), category, and priority.
   - You can accept the AI recommendations or freely modify them.
6. Click **"Review & Submit Grievance"** and confirm in the popup dialog.
7. You will be greeted with a celebration screen displaying your unique reference ID (e.g. `KGR-2026-100001`).

### B. Tracking a Complaint
1. Visit `/track` or use the quick tracking bar on the home page.
2. Enter your reference number (e.g., `KGR-2026-100001`).
3. View the full **Immutable Timeline**, assigned department, CMO directives, and officer updates.
4. If viewed anonymously by the public, citizen name and contact details are masked.

### C. Providing Feedback & Reopening
- **5-Star Rating:** Once a complaint reaches `Resolved` status, click **"Rate Service"** on your dashboard to score timeliness and officer conduct.
- **Reopening a Grievance:** If an issue reoccurs or the temporary repair fails, click **"Reopen Grievance"** on the tracking screen. Enter an explanation to reopen the case, which immediately alerts the CMO.

---

## 3. Chief Minister's Office (CMO) Administrator Journey

### A. Command Center KPI Overview
1. Sign in as `cmo@janaseva.demo` to access `/cmo/dashboard`.
2. Inspect live MongoDB aggregation metrics: Total, Submitted, Under Review, In Progress, Resolved, and Overdue SLA Breaches.
3. Review the interactive district-wise volume charts and monthly trends.

### B. Managing & Assigning Petitions
1. Switch to the **"All Grievances"** tab.
2. Search by reference number or filter by district, department, or status.
3. Click **"Assign"** on any petition to direct it to a nodal department and provide executive instructions.
4. The status transitions to `Under Review` or `In Progress`, and the citizen is notified.

### C. Reviewing Action-Taken Reports (ATR)
1. When an officer completes repairs, a **"Review ATR"** button appears.
2. Click **"Review ATR"** to examine the engineer's summary and verification details.
3. Select **"Approve Resolution"** to resolve the complaint or **"Request Additional Investigation"** if work is incomplete.

### D. Escalating Overdue Issues
- Filter by **"Show Overdue Only"** to identify complaints that exceeded their SLA window.
- Click the warning icon to escalate priority to **Urgent**, alerting departmental leadership.

---

## 4. Department Officer Journey

### A. Accessing Assigned Caseload
1. Sign in as `officer@janaseva.demo` to access `/officer/dashboard`.
2. Officers only see grievances routed to their department (e.g. Public Works Department).
3. Attempting to view grievances from unrelated departments returns a 403 Forbidden.

### B. Field Investigation & ATR Submission
1. Click **"Investigate"** to append site inspection findings (e.g., *"Site visited; bitumen crew scheduled for tomorrow"*).
2. Once physical repairs are complete, click **"Submit ATR"**.
3. Input the executive summary and action details. The report is transmitted to the CMO for final review and approval.
