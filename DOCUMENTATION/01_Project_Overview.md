# 01. Project Overview – JANASEVA AI

## 1. Project Title & Tagline
**JANASEVA AI – Intelligent Public Grievance & Governance Platform**  
*Tagline: "Every Voice Matters. Every Grievance Deserves Action."*

---

## 2. Executive Summary
JANASEVA AI is a full-stack, government-grade civic technology web platform designed and engineered for the WhiteMatrix Software Solutions machine test recruitment assessment:
> **"CM Kerala – Chief Minister's Public Grievance Redressal Portal."**

The platform modernizes public grievance redressal across the state of Kerala by providing citizens with an accessible, bilingual, transparent gateway to submit civic grievances. The platform incorporates actual Google Gemini AI capabilities for automated complaint understanding, categorization, priority scoring, and duplicate detection, while maintaining human-in-the-loop oversight through the Chief Minister’s Office (CMO) and designated Department Officers.

> [!NOTE]
> **Prototype & Non-Affiliation Disclaimer:**  
> This platform is a recruitment evaluation prototype. It is a fictional demonstration and is not affiliated with, endorsed by, or sponsored by the Government of Kerala or the Chief Minister's Office. All names, designations, complaints, and contact numbers used in demonstration data are fictional.

---

## 3. Core Problems Addressed
1. **Administrative Delays & Lost Petitions:** Grievances submitted through paper petitions or fragmented portals frequently suffer from lack of traceability and opaque processing.
2. **Citizen Uncertainty:** Citizens are rarely notified of field investigation progress, assigned officers, or estimated resolution timeframes.
3. **Misrouting & Categorization Overhead:** Manual sorting of tens of thousands of grievances across dozens of government departments causes significant routing backlogs.
4. **Duplicate Petition Load:** Community-wide issues (e.g., major water pipeline ruptures or road collapses) generate hundreds of redundant complaints that congest administrative bandwidth.
5. **Lack of Enforceable SLAs & Escalation:** Without automated deadline tracking, grievances can remain unresolved indefinitely without executive visibility.

---

## 4. Key Platform Highlights
- **Three User Personas:** Citizen, CMO Administrator, and Department Field Officer.
- **Strict Role-Based Access Control (RBAC):** Officers only access grievances assigned to their department; Citizens only access their personal grievance records; CMO administrators command cross-departmental oversight.
- **Dual-Layer Bot & Credential Security:** Every login and registration is protected by both Cloudflare Turnstile and server-generated Image CAPTCHA (`svg-captcha`).
- **Real Google Gemini LLM Integration:** Automated semantic analysis, department and category recommendations, executive summaries, and duplicate detection.
- **Bilingual Citizen Accessibility:** Full English and Malayalam (മലയാളം) language switching with accessible contrast meeting WCAG 2.2 AA standards.
- **100 Realistic Demonstration Records:** Complete idempotent database seed spanning all 14 Kerala districts and all 5 mandatory statuses.
- **Pure JavaScript Architecture:** Built strictly without TypeScript to comply 100% with technical constraints.

