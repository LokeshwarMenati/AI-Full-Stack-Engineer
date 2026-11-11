import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Shield,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  FileCheck,
  Building2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

export default function SubmitGrievancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { dept: initialDept } = router.query;

  const [formData, setFormData] = useState({
    district: 'Thiruvananthapuram',
    subject: '',
    description: '',
    category: 'Public Infrastructure',
    priority: 'Medium',
    departmentId: ''
  });

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Fetch departments
  useEffect(() => {
    apiRequest('/departments')
      .then((data) => {
        if (data.departments) {
          setDepartments(data.departments);
          if (initialDept) {
            const matched = data.departments.find(
              (d) => d.name.toLowerCase() === initialDept.toLowerCase()
            );
            if (matched) {
              setFormData((prev) => ({
                ...prev,
                departmentId: matched._id,
                category: matched.categories?.[0] || 'General'
              }));
              setCategories(matched.categories || []);
            }
          }
        }
      })
      .catch((err) => console.error(err));
  }, [initialDept]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'departmentId') {
      const selected = departments.find((d) => d._id === value);
      if (selected && selected.categories) {
        setCategories(selected.categories);
        setFormData((prev) => ({
          ...prev,
          departmentId: value,
          category: selected.categories[0] || 'General'
        }));
      }
    }
  };

  // Trigger Google Gemini AI Analysis
  const handleAnalyzeAi = async () => {
    if (!formData.subject || !formData.description) {
      setError('Please provide at least a Subject and Description to trigger AI assistance.');
      return;
    }

    setError('');
    setAnalyzingAi(true);
    try {
      const res = await apiRequest('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({
          subject: formData.subject,
          description: formData.description,
          district: formData.district
        })
      });

      if (res.success && res.analysis) {
        setAiAnalysis(res.analysis);

        // Auto-adopt AI suggestions with user editable option
        const matched = departments.find(
          (d) => d.name.toLowerCase() === res.analysis.suggestedDepartment.toLowerCase()
        );

        setFormData((prev) => ({
          ...prev,
          priority: res.analysis.priority || prev.priority,
          ...(matched && {
            departmentId: matched._id,
            category: res.analysis.suggestedCategory || matched.categories[0] || prev.category
          })
        }));

        if (matched && matched.categories) {
          setCategories(matched.categories);
        }
      }
    } catch (err) {
      setError(err.message || 'AI Assistant could not evaluate complaint text.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push('/login?redirect=/citizen/submit');
      return;
    }

    if (!formData.subject || !formData.description) {
      setError('Subject and detailed description are required.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await apiRequest('/grievances', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          aiAnalysis: aiAnalysis || null
        })
      });

      if (res.success && res.grievance) {
        setShowConfirmModal(false);
        setSubmissionSuccess(res.grievance);
        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      setError(err.message || 'Failed to submit grievance');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, show success state
  if (submissionSuccess) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border-2 border-emerald-600 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Official Grievance Registered
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Submission Successful!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Your grievance has been safely logged in the state repository and forwarded to the Chief Minister’s Secretariat.
            </p>
          </div>

          {/* Reference ID Showcase */}
          <div className="p-4 bg-slate-50 border-2 border-dashed border-amber-400 rounded-xl space-y-1">
            <p className="text-[11px] font-bold uppercase text-slate-500">
              Unique Grievance Reference Number
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 tracking-wider">
              {submissionSuccess.referenceNumber}
            </p>
            <p className="text-[11px] text-slate-500">
              Keep this reference number for all future tracking and phone queries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">District:</span>
              <span className="font-semibold text-slate-900">{submissionSuccess.district}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Priority:</span>
              <span className="font-semibold text-slate-900">{submissionSuccess.priority}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Status:</span>
              <span className="font-semibold text-emerald-800">{submissionSuccess.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">SLA Target:</span>
              <span className="font-semibold text-slate-900">
                {new Date(submissionSuccess.slaDeadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track?ref=${submissionSuccess.referenceNumber}`}
              className="flex-1 bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wider transition shadow text-center"
            >
              Track Grievance Now
            </Link>
            <Link
              href="/citizen/dashboard"
              className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-lg transition text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <Head>
        <title>Submit Grievance | JANASEVA AI</title>
      </Head>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Citizen Grievance Redressal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-serif">
            Register a Public Grievance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the details below. Our Gemini AI engine will assist in department classification.
          </p>
        </div>
        <Link
          href="/citizen/dashboard"
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District (Revenue Jurisdiction) <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {KERALA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Department (Selectable or AI Recommended) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="">Let AI Suggest / Awaiting CMO Routing</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grievance Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Water Supply Interruption, Potholes"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reported Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="Low">Low (General Inquiry / Routine)</option>
                <option value="Medium">Medium (Standard 96hr Redressal)</option>
                <option value="High">High (Severe Community Inconvenience)</option>
                <option value="Urgent">Urgent (Hazard / Immediate Danger)</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Complaint Subject (Clear Brief Summary) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="e.g. Drinking water pipeline rupture flooding colony road for 3 days"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Detailed Grievance Description <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAnalyzeAi}
                disabled={analyzingAi}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-full transition"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzingAi ? 'animate-spin' : ''}`} />
                <span>{analyzingAi ? 'Analyzing with Gemini...' : 'Analyze with Gemini AI'}</span>
              </button>
            </div>
            <textarea
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Please describe the exact location (ward, landmark), how long the issue has persisted, and the direct impact on the public..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-slate-400 mt-1">
              Personal telephone numbers and email addresses are automatically sanitized before AI classification.
            </p>
          </div>

          {/* AI Structured Recommendation Card */}
          {aiAnalysis && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Gemini AI Structured Classification Output
                </span>
                <span className="text-[11px] font-mono font-semibold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                  Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Recommended Dept:</span>
                  <span className="font-bold text-emerald-900">{aiAnalysis.suggestedDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Recommended Category:</span>
                  <span className="font-bold text-slate-800">{aiAnalysis.suggestedCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assessed Priority:</span>
                  <span className="font-bold text-amber-700">{aiAnalysis.priority}</span>
                </div>
              </div>

              <p className="text-xs text-emerald-900/90 leading-relaxed">
                <strong>Executive Reasoning:</strong> {aiAnalysis.reasoning}
              </p>

              {aiAnalysis.duplicateWarning && (
                <div className="p-2.5 bg-amber-100 text-amber-950 rounded border border-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>
                    Note: A similar complaint was recently logged in {formData.district}. CMO will cross-reference during verification.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/citizen/dashboard"
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-lg transition shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review & Submit Grievance</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Confirm Grievance Submission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please verify your grievance submission details. Once submitted, an immutable tracking reference number will be generated:
            </p>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
              <p>
                <strong>District:</strong> {formData.district}
              </p>
              <p>
                <strong>Subject:</strong> {formData.subject}
              </p>
              <p>
                <strong>Category:</strong> {formData.category}
              </p>
              <p>
                <strong>Priority:</strong> {formData.priority}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Edit Form
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="bg-[#0F4336] hover:bg-emerald-900 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
              >
                {submitting ? 'Generating Reference...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
