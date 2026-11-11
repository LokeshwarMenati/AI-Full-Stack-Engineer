import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Shield,
  FileText,
  Search,
  CheckCircle,
  ArrowRight,
  Clock,
  Building2,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../lib/api';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [trackRef, setTrackRef] = useState('');
  const [stats, setStats] = useState({
    totalGrievances: 100,
    resolved: 20,
    underReview: 20,
    inProgress: 20,
    resolutionRate: 20
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch live statistics and departments from backend
    apiRequest('/departments')
      .then((data) => {
        if (data.departments) setDepartments(data.departments);
      })
      .catch(() => {});

    // Try fetching cmo stats or public numbers
    apiRequest('/cmo/statistics')
      .then((data) => {
        if (data.statistics) {
          setStats(data.statistics);
        }
      })
      .catch(() => {
        // Fallback default state
      });
  }, []);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (trackRef.trim()) {
      router.push(`/track?ref=${encodeURIComponent(trackRef.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0F4336] via-[#134E4A] to-[#0A2E25] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b-4 border-amber-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Governance • Powered by Google Gemini AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/citizen/submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-lg text-base font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5 text-slate-950" />
                <span>{t('submitActionBtn')}</span>
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-600 px-8 py-3.5 rounded-lg text-base font-semibold transition"
              >
                <Search className="w-5 h-5 text-amber-400" />
                <span>{t('trackActionBtn')}</span>
              </Link>
            </div>

            {/* Quick Track Bar */}
            <div className="pt-6 max-w-xl mx-auto">
              <form
                onSubmit={handleQuickTrack}
                className="flex items-center bg-white/95 rounded-lg p-1.5 shadow-2xl border border-emerald-600/40"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  placeholder="Quick Track e.g. KGR-2026-100001"
                  className="w-full px-3 py-2 text-slate-900 text-sm focus:outline-none bg-transparent uppercase font-medium placeholder:normal-case"
                />
                <button
                  type="submit"
                  className="bg-[#0F4336] hover:bg-emerald-800 text-white px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition shrink-0"
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Key Performance Indicators (From MongoDB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('totalComplaints')}
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2 font-serif">
              {stats.totalGrievances || 100}+
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Aggregated across 14 Kerala districts</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('resolvedComplaints')}
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-800 mt-2 font-serif">
              {stats.resolved || 20}+
            </p>
            <p className="text-[11px] text-slate-500 mt-1">With citizen satisfaction reports</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('resolutionRate')}
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-700 mt-2 font-serif">
              {stats.resolutionRate || 20}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1">SLA compliant redressal average</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('activeDepartments')}
              </p>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-sky-800 mt-2 font-serif">
              {departments.length || 8}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Government nodal departments</p>
          </div>
        </div>
      </section>

      {/* How Grievance Redressal Works (Lifecycle Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 font-serif">
            Complete End-to-End Grievance Lifecycle
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every complaint follows a structured, role-authorized trajectory overseen by the Chief Minister’s Office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-600 transition">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Citizen Submission</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Citizen submits grievance with details. Google Gemini analyzes text and suggests department and priority instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-600 transition">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">2. CMO Administrative Review</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              CMO secretariat evaluates AI recommendations, sets SLA timeline, and assigns to the nodal department officer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-600 transition">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Field Investigation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Designated department officer conducts field investigation, logs progress remarks, and files the Action-Taken Report.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-600 transition">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Resolution & Feedback</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              CMO approves resolution. Citizen receives SMS/in-app notification and rates satisfaction or can reopen if unaddressed.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
          >
            <span>Explore Detailed 8-Stage Architecture</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Departments Grid */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
                Public Administration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-serif">
                Key Redressal Departments
              </h2>
            </div>
            <Link
              href="/departments"
              className="mt-3 sm:mt-0 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>View All 8 Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(departments.length > 0 ? departments : [
              { code: 'PWD', name: 'Public Works Department', description: 'Roadways, highways, bridges, potholes, public buildings.' },
              { code: 'WATER', name: 'Water Resources Department', description: 'KWA drinking water pipes, supply disruptions, irrigation.' },
              { code: 'HEALTH', name: 'Health Department', description: 'Hospital hygiene, PHC facilities, medicine supplies.' },
              { code: 'KSEB', name: 'Electricity Department', description: 'Power cuts, low voltage, hazardous overhead cables.' }
            ]).slice(0, 4).map((dept) => (
              <div
                key={dept.code}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-amber-700 font-mono tracking-wider">
                    {dept.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 font-serif">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold">Active Redressal</span>
                  <Link
                    href={`/citizen/submit?dept=${encodeURIComponent(dept.name)}`}
                    className="text-xs font-bold text-slate-900 hover:text-emerald-800"
                  >
                    File Grievance →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Citizen Rights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F4336] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-emerald-800">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Citizen Privacy & Security First
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                Protected by Cloudflare Turnstile & SVG Image Verification
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                Every grievance submission is shielded with dual-layer bot protection, encrypted data handling, and privacy masking. Public tracking never exposes citizen identity or personal phone numbers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link
                href="/citizen/submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-center text-sm shadow-md transition"
              >
                File Verified Grievance
              </Link>
              <Link
                href="/about"
                className="border border-emerald-600 hover:bg-emerald-800/80 text-white font-medium px-6 py-3 rounded-lg text-center text-sm transition"
              >
                Learn About Service Principles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
