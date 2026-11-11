# 05. AI Integration – Google Gemini & Safeguards

## 1. Overview
JANASEVA AI utilizes **Google Gemini** (`gemini-1.5-flash`) via the official `@google/generative-ai` SDK to provide intelligence throughout the grievance redressal lifecycle. 

Crucially, the system does not use static keyword matching to fake AI functionality; it establishes an end-to-end integration designed according to strict civic safety and privacy-by-design standards.

---

## 2. Structured LLM Output Contract
When a citizen drafts a complaint, the backend invokes Gemini with a constrained JSON output prompt:

```json
{
  "suggestedDepartment": "Water Resources Department",
  "suggestedCategory": "Water Supply Interruption",
  "priority": "High",
  "summary": "120 residential households reporting complete drinking water shutdown for 5 days due to culvert pipeline rupture.",
  "reasoning": "Severe duration and widespread community disruption warrant expedited high-priority investigation.",
  "confidence": 0.94,
  "duplicateWarning": false
}
```

---

## 3. Advanced Semantic Capabilities

### A. Semantic Duplicate Detection
When a citizen enters a complaint in a specific district, the backend cross-references active grievances within that jurisdiction using tokenized word-overlap and cosine similarity:
- Detects recurring complaints regarding the same burst pipe, bridge collapse, or power outage.
- Flags the petition with a `duplicateWarning: true` and attaches matching reference numbers.
- Prevents redundant field contractor dispatches while allowing CMO to link related petitions.

### B. Action-Taken Report (ATR) Executive Summarization
Department officers frequently file detailed technical reports mentioning bitumen grades, excavation dimensions, and contractor invoices. The Gemini model distills these technical accounts into 2-sentence executive briefs for the Chief Minister’s Secretariat, accelerating resolution approvals.

---

## 4. Mandatory AI Safeguards & Civic Guardrails

> [!IMPORTANT]
> **Core Principle: AI Recommends, Humans Decide**  
> Under no circumstances can AI independently resolve, reject, escalate, or close a citizen grievance. Official decisions remain the sole responsibility of CMO administrators and verified department officers.

1. **PII Sanitization Gateway:**  
   Before any text is transmitted to an external LLM provider, regex filters redact:
   - Indian phone numbers (`+91`, `9847...`) -> `[REDACTED_PHONE]`
   - Citizen email addresses -> `[REDACTED_EMAIL]`
   - Aadhaar-pattern identification numbers -> `[REDACTED_ID]`
2. **Schema & Department Integrity Guardrail:**  
   AI output is cross-referenced against the active `Department` documents in MongoDB. If the model hallucinates an invalid agency or arbitrary department name, the system safely falls back to verified database records.
3. **Graceful Offline & Rate-Limit Fallback:**  
   If the Gemini API key is omitted in local development or if Google Cloud endpoints experience rate limits or timeouts, the built-in contextual fallback engine takes over. The application continues functioning without throwing 500 errors or interrupting the citizen.
4. **Zero Frontend Key Exposure:**  
   The `GEMINI_API_KEY` is maintained strictly in server-side environment variables and is never exposed to client bundles or browser consoles.
