import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Search,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  RotateCcw,
  Star,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export default function TrackGrievancePage() {
  const router = useRouter();
  const { ref: queryRef } = router.query;
  const { user } = useAuth();

  const [referenceInput, setReferenceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState(null);

  // Reopen modal state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopenLoading, setReopenLoading] = useState(false);
  const [reopenSuccess, setReopenSuccess] = useState('');

  useEffect(() => {
    if (queryRef) {
      setReferenceInput(queryRef);
      fetchTracking(queryRef);
    }
  }, [queryRef]);

  const fetchTracking = async (refNum) => {
    if (!refNum.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest(`/grievances/track/${encodeURIComponent(refNum.trim().toUpperCase())}`);
      if (res.success && res.trackingData) {
        setTrackingData(res.trackingData);
      }
    } catch (err) {
      setError(err.message || 'No grievance record found with this reference ID.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (referenceInput.trim()) {
      router.push(`/track?ref=${encodeURIComponent(referenceInput.trim().toUpperCase())}`, undefined, { shallow: true });
      fetchTracking(referenceInput);
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason || reopenReason.trim().length < 10) {
      alert('Please provide a reason with at least 10 characters.');
      return;
    }

    setReopenLoading(true);
    try {
      // Find full grievance ID or call reopen by reference
      const res = await apiRequest(`/grievances/${trackingData.referenceNumber}/reopen`, {
        method: 'POST',
        body: JSON.stringify({ reason: reopenReason })
      });
      if (res.success) {
        setReopenSuccess('Grievance has been reopened for reinvestigation.');
        setTimeout(() => {
          setShowReopenModal(false);
          fetchTracking(trackingData.referenceNumber);
        }, 1200);
      }
    } catch (err) {
      alert(err.message || 'Only authorized citizen owners or CMO can reopen complaints.');
    } finally {
      setReopenLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <Head>
        <title>Track Grievance Status | JANASEVA AI</title>
      </Head>

      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Public & Citizen Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          Track Grievance Redressal Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter your unique reference ID to verify ground investigation updates, CMO remarks, and resolution timeline.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              placeholder="e.g. KGR-2026-100001"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-emerald-700 focus:outline-none placeholder:normal-case font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg transition disabled:opacity-50 shadow shrink-0"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 pb-6">
          {/* Header Card */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
                  {trackingData.referenceNumber}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {trackingData.district}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1 font-serif">
                {trackingData.subject}
              </h2>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Current Status
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  trackingData.status === 'Resolved'
                    ? 'bg-emerald-500 text-slate-950 font-extrabold'
                    : trackingData.status === 'In Progress'
                    ? 'bg-blue-400 text-slate-950 font-extrabold'
                    : trackingData.status === 'Under Review'
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : trackingData.status === 'Reopened'
                    ? 'bg-purple-400 text-slate-950 font-extrabold'
                    : 'bg-slate-200 text-slate-950'
                }`}
              >
                {trackingData.status}
              </span>
            </div>
          </div>

          <div className="px-6 sm:px-8 space-y-6">
            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nodal Department</span>
                <span className="font-semibold text-slate-800">{trackingData.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-800">{trackingData.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Submitted On</span>
                <span className="font-semibold text-slate-800">
                  {new Date(trackingData.submissionDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Citizen Identity</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  {trackingData.citizen?.name || 'Protected'}
                </span>
              </div>
            </div>

            {/* Official Remarks Box */}
            {(trackingData.cmoRemarks || trackingData.officerRemarks || trackingData.resolutionDetails) && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  Administrative Redressal Dispatches
                </h3>

                {trackingData.cmoRemarks && (
                  <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 mb-1">
                      Chief Minister’s Secretariat Directive:
                    </p>
                    <p>{trackingData.cmoRemarks}</p>
                  </div>
                )}

                {trackingData.officerRemarks && (
                  <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-950">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-blue-800 mb-1">
                      Department Field Investigation Update:
                    </p>
                    <p>{trackingData.officerRemarks}</p>
                  </div>
                )}

                {trackingData.actionTakenSummary && (
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                      Action-Taken Report Summary:
                    </p>
                    <p>{trackingData.actionTakenSummary}</p>
                  </div>
                )}

                {trackingData.resolutionDetails && (
                  <div className="p-3.5 bg-emerald-100 rounded-lg border border-emerald-300 text-xs text-emerald-950">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 mb-1">
                      Official Resolution Order ({new Date(trackingData.resolutionDetails.resolvedAt).toLocaleDateString()}):
                    </p>
                    <p>{trackingData.resolutionDetails.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Lifecycle Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Immutable Status History Chain
              </h3>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {trackingData.timeline && trackingData.timeline.length > 0 ? (
                  trackingData.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 z-10 shadow-sm text-xs font-bold">
                        ✓
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex-grow text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>Status: {item.newStatus}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{item.remarks || item.actionType}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Timeline being compiled.</p>
                )}
              </div>
            </div>

            {/* Reopen Action for Citizens if Resolved */}
            {trackingData.status === 'Resolved' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-bold text-amber-950 block">Ground Issue Persisting?</span>
                  <span className="text-amber-900/80">
                    If the reported problem was not adequately fixed, citizens can trigger a reinvestigation.
                  </span>
                </div>
                <button
                  onClick={() => setShowReopenModal(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen Grievance</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Reopen Grievance for Reinvestigation
            </h3>
            <p className="text-xs text-slate-600">
              Please state why the grievance resolution is unsatisfactory (e.g. temporary fix failed, recurrence).
            </p>

            {reopenSuccess && (
              <p className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                {reopenSuccess}
              </p>
            )}

            <form onSubmit={handleReopen} className="space-y-4">
              <textarea
                rows={4}
                required
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Explain the ongoing issue clearly (minimum 10 characters)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
              ></textarea>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reopenLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {reopenLoading ? 'Submitting...' : 'Reopen Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

