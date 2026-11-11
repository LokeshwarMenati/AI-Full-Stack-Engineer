import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Bell,
  Star,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

export default function CitizenDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [grievances, setGrievances] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackModal, setFeedbackModal] = useState({ open: false, grievance: null });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedbackText: '' });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const [gRes, nRes] = await Promise.all([
        apiRequest(`/grievances${query}`),
        apiRequest('/notifications')
      ]);

      if (gRes.grievances) setGrievances(gRes.grievances);
      if (nRes.notifications) setNotifications(nRes.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalGrievances = grievances.length;
  const resolvedCount = grievances.filter((g) => g.status === 'Resolved').length;
  const pendingCount = totalGrievances - resolvedCount;

  const handleOpenFeedback = (grievance) => {
    setFeedbackModal({ open: true, grievance });
    setFeedbackForm({ rating: 5, feedbackText: '' });
    setFeedbackSuccess('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    try {
      const res = await apiRequest('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: feedbackModal.grievance._id,
          rating: feedbackForm.rating,
          feedbackText: feedbackForm.feedbackText
        })
      });

      if (res.success) {
        setFeedbackSuccess('Thank you! Your feedback has been recorded.');
        setTimeout(() => {
          setFeedbackModal({ open: false, grievance: null });
          loadData();
        }, 1200);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading citizen credentials...</div>;
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <Head>
        <title>Citizen Dashboard | JANASEVA AI</title>
      </Head>

      {/* Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Citizen Grievance Redressal Desk
          </span>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Welcome, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-500">
            Registered Email: {user?.email} • Mobile: {user?.mobileNumber || 'Not specified'}
          </p>
        </div>

        <Link
          href="/citizen/submit"
          className="inline-flex items-center justify-center gap-2 bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow transition"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Submit New Grievance</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Submitted</span>
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-serif">{totalGrievances}</p>
          <p className="text-[11px] text-slate-400 mt-1">Logged under your citizen profile</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Pending Redressal</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-700 mt-2 font-serif">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under investigation or CMO review</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Resolved Complaints</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-800 mt-2 font-serif">{resolvedCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Action-taken reports approved</p>
        </div>
      </div>

      {/* Main Grid: Grievance History + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Grievances Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              My Grievance History
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-emerald-900 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st || 'All'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Loading grievances...
            </div>
          ) : grievances.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No grievances found</p>
              <p className="text-xs text-slate-500">
                You haven’t submitted any grievances in this status category yet.
              </p>
              <Link
                href="/citizen/submit"
                className="inline-block bg-[#0F4336] text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Submit First Grievance
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {grievances.map((g) => (
                <div
                  key={g._id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-900">
                        {g.referenceNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500">{g.district}</span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : g.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : g.status === 'Reopened'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-serif">{g.subject}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
                    <span>
                      Dept: <strong>{g.department?.name || 'Awaiting CMO Assignment'}</strong>
                    </span>
                    <span>Submitted: {new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Link
                      href={`/track?ref=${g.referenceNumber}`}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <span>Track Full Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {g.status === 'Resolved' && !g.hasFeedback && (
                      <button
                        onClick={() => handleOpenFeedback(g)}
                        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-md transition flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>Rate Service</span>
                      </button>
                    )}

                    {g.hasFeedback && (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Feedback Submitted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: In-App Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-800" />
              <span>Notifications</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              {notifications.length} recent
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 max-h-[550px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition space-y-1"
                >
                  <p className="text-xs font-bold text-slate-900">{n.title}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Citizen Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Submit Citizen Redressal Feedback
            </h3>
            <p className="text-xs text-slate-600">
              How satisfied are you with the resolution of grievance{' '}
              <strong>{feedbackModal.grievance?.referenceNumber}</strong>?
            </p>

            {feedbackSuccess && (
              <p className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                {feedbackSuccess}
              </p>
            )}

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= feedbackForm.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comments & Satisfaction Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackForm.feedbackText}
                  onChange={(e) =>
                    setFeedbackForm({ ...feedbackForm, feedbackText: e.target.value })
                  }
                  placeholder="Tell us if the repair was adequate and completed in a timely manner..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {feedbackSubmitting ? 'Saving...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

