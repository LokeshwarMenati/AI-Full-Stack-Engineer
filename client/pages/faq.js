import React, { useState } from 'react';
import Head from 'next/head';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How do I register as a citizen on JANASEVA AI?',
      a: 'Click on the "Sign Up" button on the top menu. Enter your Full Name, Email Address, Mobile Number, and Password. Complete the two mandatory verification challenges: Cloudflare Turnstile and the Image CAPTCHA. Upon submitting, your account is immediately verified and active.'
    },
    {
      q: 'What is the format of the Grievance Reference Number and how is it generated?',
      a: 'Every grievance receives an immutable, server-generated reference number formatted as KGR-YYYY-NNNNNN (for instance: KGR-2026-100001). This format guarantees year-wise uniqueness and prevents sequential tampering.'
    },
    {
      q: 'How does the Google Gemini AI Assistant help during grievance submission?',
      a: 'As you type your complaint subject and description, Google Gemini evaluates the contextual text, redacts sensitive personal phone/email information, and recommends the appropriate nodal department (e.g. Water Resources, PWD, Electricity), category, and priority level. You can review and edit these recommendations before submitting.'
    },
    {
      q: 'Can anyone view my personal information using the public tracking tool?',
      a: 'No. To strictly preserve citizen privacy, the public tracking tool masks all personal information (such as your name and email address) and hides confidential internal administrative notes. Only authorized CMO administrators and the citizen owner can view complete unmasked details.'
    },
    {
      q: 'What are the five mandatory statuses a grievance moves through?',
      a: 'The five statuses are: 1. Submitted (received from citizen), 2. Under Review (screened by CMO secretariat), 3. In Progress (field officer investigating/rectifying), 4. Resolved (ATR approved by CMO), and 5. Reopened (citizen requests reinvestigation due to recurring ground issues).'
    },
    {
      q: 'What happens if my grievance is not resolved within the promised timeframe?',
      a: 'Every grievance has a calculated SLA deadline (24 hours for Urgent, 48 hours for High, 96 hours for Medium). If this deadline lapses, the system flags the complaint as "Overdue", visually alerting CMO administrators to escalate the grievance directly to senior department leadership.'
    },
    {
      q: 'How do I provide feedback or reopen a resolved complaint?',
      a: 'Once your grievance reaches "Resolved" status, navigate to your Citizen Dashboard or the Tracking page. You will see an interactive 5-star rating widget to evaluate timeliness and officer conduct. If the issue was not satisfactorily resolved, you can click "Reopen Grievance" with an explanation.'
    },
    {
      q: 'Is this portal officially affiliated with the Government of Kerala?',
      a: 'No. JANASEVA AI is a recruitment machine test demonstration prototype developed for WhiteMatrix Software Solutions evaluation. All data, departments, and credentials presented are purely fictional demonstration records.'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <Head>
        <title>Frequently Asked Questions (FAQ) | JANASEVA AI</title>
      </Head>

      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Help & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Everything you need to know about submitting, tracking, and resolving grievances on JANASEVA AI.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-emerald-800 transition"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{item.q}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
