import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Building2,
  Search,
  FileCheck2,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Send,
  Eye,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

export default function OfficerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [grievances, setGrievances] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [investigationModal, setInvestigationModal] = useState({ open: false, grievance: null });
  const [investigationRemarks, setInvestigationRemarks] = useState('');
  const [actionReportModal, setActionReportModal] = useState({ open: false, grievance: null });
  const [atrForm, setAtrForm] = useState({ summary: '', actionsDetails: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'officer' && user.role !== 'cmo_admin'))) {
      router.push('/login');
      return;
    }

    if (user) {
      loadAssignedGrievances();
    }
  }, [user, authLoading, statusFilter]);

  const loadAssignedGrievances = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search })
      });

      const res = await apiRequest(`/officer/assigned?${params.toString()}`);
      if (res.success) {
        setGrievances(res.grievances);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAssignedGrievances();
  };

  // Submit Investigation Remarks
  const handleInvestigationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiRequest('/officer/investigation', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: investigationModal.grievance._id,
          remarks: investigationRemarks
        })
      });

      if (res.success) {
        setInvestigationModal({ open: false, grievance: null });
        loadAssignedGrievances();
      }
    } catch (err) {
      alert(err.message || 'Failed to update investigation remarks');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Action-Taken Report
  const handleAtrSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiRequest('/officer/action-report', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: actionReportModal.grievance._id,
          summary: atrForm.summary,
          actionsDetails: atrForm.actionsDetails
        })
      });

      if (res.success) {
        setActionReportModal({ open: false, grievance: null });
        loadAssignedGrievances();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit action report');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="py-20 text-center text-xs">Authenticating department officer...</div>;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      <Head>
        <title>Department Officer Desk | JANASEVA AI</title>
      </Head>

      {/* Header Banner */}
      <div className="bg-[#0F4336] text-white p-6 rounded-2xl shadow-md border-b-4 border-sky-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-sky-400 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
            Nodal Department Desk
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
            {user?.department?.name || 'Department Officer Workspace'}
          </h1>
          <p className="text-xs text-emerald-100/90">
            Officer: {user?.name} • Designation: {user?.designation || 'Assistant Executive Engineer'}
          </p>
        </div>

        <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800 text-xs">
          <span className="text-slate-300 block text-[11px]">Assigned Caseload</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{totalCount}</span>
        </div>
      </div>

      {/* Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Grievances Assigned for Field Redressal
          </h2>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </form>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
            >
              <option value="">All Statuses</option>
              {['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">District & Location</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SLA Target</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Loading department records...
                  </td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No grievances assigned matching the criteria.
                  </td>
                </tr>
              ) : (
                grievances.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-950">
                      {g.referenceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold block">{g.district}</span>
                      <span className="text-[11px] text-slate-400">{g.category}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={g.subject}>
                      {g.subject}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : g.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {g.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          g.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : g.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(g.slaDeadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedGrievance(g)}
                        className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setInvestigationModal({ open: true, grievance: g });
                          setInvestigationRemarks(g.officerRemarks || '');
                        }}
                        className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold transition"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => {
                          setActionReportModal({ open: true, grievance: g });
                          setAtrForm({
                            summary: g.actionTakenReport?.summary || '',
                            actionsDetails: g.actionTakenReport?.actionsDetails || ''
                          });
                        }}
                        className="px-2 py-1 text-[11px] bg-[#0F4336] hover:bg-emerald-900 text-white rounded font-bold transition shadow-sm"
                      >
                        Submit ATR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-mono font-bold text-emerald-950 text-base">
                {selectedGrievance.referenceNumber}
              </span>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-sm text-slate-900">{selectedGrievance.subject}</h3>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border leading-relaxed">
                {selectedGrievance.description}
              </p>
              {selectedGrievance.cmoRemarks && (
                <div className="p-3 bg-amber-50 text-amber-950 rounded border border-amber-200">
                  <span className="font-bold">CMO Directive:</span> {selectedGrievance.cmoRemarks}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 bg-slate-100 rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Remarks Modal */}
      {investigationModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Record Field Investigation Progress
            </h3>
            <p className="text-xs text-slate-500">
              Grievance: {investigationModal.grievance?.referenceNumber}
            </p>

            <form onSubmit={handleInvestigationSubmit} className="space-y-4">
              <textarea
                rows={4}
                required
                value={investigationRemarks}
                onChange={(e) => setInvestigationRemarks(e.target.value)}
                placeholder="Site visited. Pipeline leakage identified near culvert. Repair crew notified..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInvestigationModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0F4336] text-white font-bold text-xs px-5 py-2 rounded transition"
                >
                  {submitting ? 'Updating...' : 'Save Remarks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action-Taken Report Submission Modal */}
      {actionReportModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Submit Action-Taken Report (ATR) to CMO
            </h3>
            <p className="text-xs text-slate-500">
              Provide complete proof of physical redressal for Chief Minister’s Office approval.
            </p>

            <form onSubmit={handleAtrSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Redressal Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={atrForm.summary}
                  onChange={(e) => setAtrForm({ ...atrForm, summary: e.target.value })}
                  placeholder="e.g. 50-meter water pipeline ruptured segment replaced and pressure restored."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Actions & Verification Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={atrForm.actionsDetails}
                  onChange={(e) => setAtrForm({ ...atrForm, actionsDetails: e.target.value })}
                  placeholder="Describe civil contractors dispatched, work timeline, materials utilized, and confirmation from local residents..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionReportModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0F4336] text-white font-bold text-xs px-5 py-2 rounded transition"
                >
                  {submitting ? 'Submitting to CMO...' : 'Submit Action Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
