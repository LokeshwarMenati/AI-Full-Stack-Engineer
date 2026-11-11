import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FileText,
  Hash,
  ShieldAlert,
  Building2,
  Search,
  FileCheck2,
  CheckCircle,
  RotateCcw,
  Star,
  ArrowDown
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Citizen Submission & AI Assistance',
      role: 'Citizen & AI Assistant',
      desc: 'Citizen inputs district, subject, and description. Google Gemini analyzes the complaint in real time to recommend the proper department, category, and priority before final submission.',
      icon: FileText,
      badge: 'Step 1'
    },
    {
      num: 2,
      title: 'Safe Reference ID Generation',
      role: 'Backend Core Engine',
      desc: 'A tamper-proof unique tracking ID is generated safely on the server in KGR-YYYY-NNNNNN format (e.g. KGR-2026-100001). Initial immutable history record is logged.',
      icon: Hash,
      badge: 'Step 2'
    },
    {
      num: 3,
      title: 'CMO Secretariat Review & SLA Setting',
      role: 'Chief Minister’s Office (CMO)',
      desc: 'CMO administrative officers review the AI categorization, examine duplicate warnings, set mandatory SLA countdowns, and can escalate delayed issues.',
      icon: ShieldAlert,
      badge: 'Step 3'
    },
    {
      num: 4,
      title: 'Department & Officer Assignment',
      role: 'CMO to Department Officer',
      desc: 'Grievance moves to "Under Review" or "In Progress" and is assigned directly to the relevant nodal department (e.g. PWD, KWA, Health) and designated assistant executive engineer.',
      icon: Building2,
      badge: 'Step 4'
    },
    {
      num: 5,
      title: 'Field Investigation & Progress Updates',
      role: 'Department Field Officer',
      desc: 'The assigned officer visits the site, assesses ground conditions, updates investigation remarks, and attaches work estimates. Citizen is notified automatically.',
      icon: Search,
      badge: 'Step 5'
    },
    {
      num: 6,
      title: 'Action-Taken Report (ATR) Submission',
      role: 'Department Officer',
      desc: 'Officer concludes physical rectification (e.g. pipeline replacement, road patching) and submits a comprehensive Action-Taken Report with AI summary to the CMO.',
      icon: FileCheck2,
      badge: 'Step 6'
    },
    {
      num: 7,
      title: 'CMO Review & Final Approval',
      role: 'Chief Minister’s Office (CMO)',
      desc: 'CMO administrator audits the submitted action report. They approve the final resolution or demand further field investigation if civic standards are not met.',
      icon: CheckCircle,
      badge: 'Step 7'
    },
    {
      num: 8,
      title: 'Citizen Notification & Democratic Feedback',
      role: 'Citizen Redressal Closure',
      desc: 'Status transitions to "Resolved". Citizen rates service timeliness and quality (1-5 stars). If ground issue persists, citizen can reopen the complaint with explanation.',
      icon: Star,
      badge: 'Step 8'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 font-sans">
      <Head>
        <title>How It Works | JANASEVA AI Lifecycle</title>
      </Head>

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Workflow Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
          Grievance Lifecycle from Submission to Resolution
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          A completely traceable 8-stage redressal process ensuring total transparency and ministerial oversight.
        </p>
      </div>

      {/* Step by step timeline list */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="relative flex items-start gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-800 text-emerald-800 font-bold flex items-center justify-center shrink-0 shadow-md group-hover:bg-emerald-800 group-hover:text-white transition">
                <Icon className="w-7 h-7" />
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-grow space-y-2 hover:border-emerald-700 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {step.badge} • {step.role}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Phase 0{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reopening & Reinvestigation Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
          <RotateCcw className="w-7 h-7" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-grow">
          <h4 className="text-base font-bold text-amber-950">Citizen Right to Reopen Grievance</h4>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Unlike static portals where complaints are closed without recourse, JANASEVA AI empowers citizens to reopen resolved grievances if an issue recurs, automatically alerting the Chief Minister’s Office for priority escalation.
          </p>
        </div>
        <Link
          href="/citizen/submit"
          className="bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase px-5 py-3 rounded-lg tracking-wider shrink-0 shadow transition"
        >
          Submit Grievance
        </Link>
      </div>
    </div>
  );
}
