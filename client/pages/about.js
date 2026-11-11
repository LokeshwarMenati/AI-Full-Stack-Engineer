import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Target, Compass, Award, CheckCircle2, Users, FileCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <Head>
        <title>About Us | JANASEVA AI – Public Grievance Redressal</title>
      </Head>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Governance & Ethics
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
          About JANASEVA AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Inspired by the Chief Minister’s Public Grievance Redressal Portal (CM Kerala), JANASEVA AI establishes an intelligent bridge between citizens and state administrative machinery.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To build an inclusive, equitable, and transparent civic ecosystem where every citizen voice is promptly heard, intelligently classified, and redressed by designated authorities within strict time-bound SLAs.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Harnessing state-of-the-art AI language models to minimize bureaucratic delays, eliminate duplicate complaints, route civic issues directly to field officers, and maintain complete auditability through CMO executive supervision.
          </p>
        </div>
      </div>

      {/* Primary Objectives */}
      <div className="bg-slate-100 p-8 sm:p-10 rounded-2xl border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-6 text-center">
          Key Strategic Objectives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">Zero Administrative Blindspots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time aggregation pipelines track overdue grievances across all 14 districts with instant escalation warnings.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">AI-Guided Categorization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini language model classifies grievances to appropriate departments while preserving citizen privacy.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">Citizen Centric Accountability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every status change is immutable. Citizens can track progress publicly and reopen grievances if redressal is substandard.
            </p>
          </div>
        </div>
      </div>

      {/* Citizen Service Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-serif text-center">
          Citizen-Focused Service Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">01</span>
            <h4 className="font-bold text-sm text-slate-900">Universal Accessibility</h4>
            <p className="text-xs text-slate-600">English and Malayalam bilingual support adhering to WCAG 2.2 AA.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">02</span>
            <h4 className="font-bold text-sm text-slate-900">Privacy by Design</h4>
            <p className="text-xs text-slate-600">Public tracking masks personal identifiers and phone numbers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">03</span>
            <h4 className="font-bold text-sm text-slate-900">Time-Bound Redressal</h4>
            <p className="text-xs text-slate-600">Configurable SLA deadlines from 24 hours for urgent to 96 hours.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">04</span>
            <h4 className="font-bold text-sm text-slate-900">Democratic Feedback</h4>
            <p className="text-xs text-slate-600">Post-resolution rating and comments directly impact departmental metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

