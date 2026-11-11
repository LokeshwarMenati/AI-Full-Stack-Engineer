import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ShieldAlert,
  BarChart3,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Building2,
  Send,
  Eye,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
  'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
  'Kannur', 'Kasaragod'
];

const COLORS = ['#0F4336', '#D97706', '#0284C7', '#10B981', '#8B5CF6', '#F43F5E'];

export default function CmoDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'grievances' | 'analytics'
  const [stats, setStats] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);

  // Modals
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [assignModal, setAssignModal] = useState({ open: false, grievance: null });
  const [assignForm, setAssignForm] = useState({ departmentId: '', instructions: '' });
  const [escalateModal, setEscalateModal] = useState({ open: false, grievance: null });
  const [escalateRemarks, setEscalateRemarks] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, grievance: null });
  const [reviewDecision, setReviewDecision] = useState('APPROVE');
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'cmo_admin')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'cmo_admin') {
      fetchStatistics();
      fetchDepartments();
      fetchGrievances();
    }
  }, [user, authLoading, page, selectedDistrict, selectedDept, selectedStatus, selectedPriority, isOverdueOnly]);

  const fetchStatistics = async () => {
    try {
      const res = await apiRequest('/cmo/statistics');
      if (res.success) setStats(res.statistics);
    } catch (e) {
      console.error('Stats fetch failed', e);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await apiRequest('/departments');
      if (res.success) setDepartments(res.departments);
    } catch (e) {}
  };

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(selectedDistrict && { district: selectedDistrict }),
        ...(selectedDept && { department: selectedDept }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedPriority && { priority: selectedPriority }),
        ...(isOverdueOnly && { isOverdue: 'true' })
      });

      const res = await apiRequest(`/cmo/grievances?${params.toString()}`);
      if (res.success) {
        setGrievances(res.grievances);
        setTotalCount(res.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchGrievances();
  };

  // Assign Department Handler
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiRequest('/cmo/assign', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: assignModal.grievance._id,
          departmentId: assignForm.departmentId,
          instructions: assignForm.instructions
        })
      });

      if (res.success) {
        setAssignModal({ open: false, grievance: null });
        fetchGrievances();
        fetchStatistics();
      }
    } catch (e) {
      alert(e.message || 'Assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Escalate Handler
  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiRequest('/cmo/escalate', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: escalateModal.grievance._id,
          escalationRemarks: escalateRemarks
        })
      });

      if (res.success) {
        setEscalateModal({ open: false, grievance: null });
        fetchGrievances();
        fetchStatistics();
      }
    } catch (e) {
      alert(e.message || 'Escalation failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Review Report Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiRequest('/cmo/review-report', {
        method: 'POST',
        body: JSON.stringify({
          grievanceId: reviewModal.grievance._id,
          decision: reviewDecision,
          cmoReviewNotes: reviewNotes
        })
      });

      if (res.success) {
        setReviewModal({ open: false, grievance: null });
        fetchGrievances();
        fetchStatistics();
      }
    } catch (e) {
      alert(e.message || 'Review submission failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) return <div className="py-20 text-center text-xs">Authenticating CMO clearance...</div>;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      <Head>
        <title>CMO Command Center | JANASEVA AI</title>
      </Head>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F4336] text-white p-6 rounded-2xl shadow-lg border-b-4 border-amber-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold font-serif text-white">
              Chief Minister’s Office Grievance Secretariat
            </span>
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
              Command Center
            </span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Executive State Dashboard • Logged in as: {user?.name} ({user?.designation || 'CMO Secretary'})
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-2 bg-emerald-950/80 p-1.5 rounded-xl border border-emerald-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Overview KPI
          </button>
          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'grievances' ? 'bg-amber-500 text-slate-950' : 'text-emerald-200 hover:text-white'
            }`}
          >
            All Grievances ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Analytics & Trends
          </button>
        </div>
      </div>

      {/* Aggregation Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Grievances</span>
            <span className="text-2xl font-bold text-slate-900 font-serif">{stats.totalGrievances}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Submitted</span>
            <span className="text-2xl font-bold text-slate-700 font-serif">{stats.submitted}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-amber-700 block">Under Review</span>
            <span className="text-2xl font-bold text-amber-600 font-serif">{stats.underReview}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-sky-700 block">In Progress</span>
            <span className="text-2xl font-bold text-sky-600 font-serif">{stats.inProgress}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Resolved</span>
            <span className="text-2xl font-bold text-emerald-800 font-serif">{stats.resolved}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/40 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-red-700 block">Overdue Breaches</span>
            <span className="text-2xl font-bold text-red-700 font-serif">{stats.overdueCount}</span>
          </div>
        </div>
      )}

      {/* Tab 1: Overview & Recent Alerts */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                District-Wise Grievance Volume (Top 8)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Live DB Aggregation</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.districtWise.slice(0, 8)}>
                  <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0F4336" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">Priority Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.priorityDistribution}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ priority, percent }) => `${priority} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Grievance Management Table with Filters */}
      {(activeTab === 'grievances' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              State Grievance Register
            </h3>

            {/* Quick Overdue Toggle */}
            <button
              onClick={() => setIsOverdueOnly(!isOverdueOnly)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                isOverdueOnly
                  ? 'bg-red-700 text-white'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Show Overdue Only</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Ref ID or Subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </form>

            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="">All 14 Districts</option>
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="">All Priorities</option>
              {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">Citizen & District</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      Loading state records...
                    </td>
                  </tr>
                ) : grievances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No records match the active criteria.
                    </td>
                  </tr>
                ) : (
                  grievances.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-950">
                        {g.referenceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold block">{g.citizen?.name || 'Citizen'}</span>
                        <span className="text-[11px] text-slate-400">{g.district}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate" title={g.subject}>
                        {g.subject}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {g.department?.name || <span className="text-amber-600">Unassigned</span>}
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
                              : g.status === 'Reopened'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {g.status}
                        </span>
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
                            setAssignModal({ open: true, grievance: g });
                            setAssignForm({ departmentId: g.department?._id || '', instructions: '' });
                          }}
                          className="px-2 py-1 text-[11px] bg-emerald-50 text-emerald-900 border border-emerald-300 rounded font-bold hover:bg-emerald-100 transition"
                        >
                          Assign
                        </button>
                        {g.actionTakenReport?.summary && g.status !== 'Resolved' && (
                          <button
                            onClick={() => {
                              setReviewModal({ open: true, grievance: g });
                              setReviewNotes('');
                            }}
                            className="px-2 py-1 text-[11px] bg-amber-50 text-amber-900 border border-amber-300 rounded font-bold hover:bg-amber-100 transition"
                          >
                            Review ATR
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEscalateModal({ open: true, grievance: g });
                            setEscalateRemarks('');
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Escalate Issue"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing Page {page} of {Math.ceil(totalCount / 10) || 1} ({totalCount} total grievances)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= Math.ceil(totalCount / 10)}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Analytics & Monthly Trends */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Monthly Redressal & Ingestion Trends
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="submitted" stroke="#0F4336" strokeWidth={2} name="Submitted" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Department Performance Breakdown
              </h3>
              <div className="space-y-3">
                {stats.departmentWise.slice(0, 6).map((dept, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50">
                    <span className="font-semibold text-slate-800">{dept.department}</span>
                    <div className="flex items-center gap-3">
                      <span>Total: {dept.count}</span>
                      <span className="text-emerald-700 font-bold">Resolved: {dept.resolved}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Top Grievance Categories
              </h3>
              <div className="space-y-2">
                {stats.categoryDistribution.slice(0, 6).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded border border-slate-100">
                    <span className="text-slate-700">{c.category}</span>
                    <span className="font-bold font-mono text-emerald-950">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Grievance Details Drawer/Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono font-bold text-emerald-900 text-lg">
                  {selectedGrievance.referenceNumber}
                </span>
                <span className="text-xs text-slate-400 ml-2">({selectedGrievance.district})</span>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-base font-bold text-slate-900 font-serif">
                {selectedGrievance.subject}
              </p>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border">
                {selectedGrievance.description}
              </p>

              {/* Gemini AI Recommendation Box */}
              {selectedGrievance.aiAnalysis && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Gemini Analysis
                  </span>
                  <p className="text-slate-600">
                    Suggested: {selectedGrievance.aiAnalysis.suggestedDepartment} ({selectedGrievance.aiAnalysis.suggestedCategory})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Reasoning: {selectedGrievance.aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              {/* Action Taken Report */}
              {selectedGrievance.actionTakenReport?.summary && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900">Officer Action-Taken Report</span>
                  <p className="text-slate-800">{selectedGrievance.actionTakenReport.summary}</p>
                  <p className="text-[11px] text-slate-600">
                    {selectedGrievance.actionTakenReport.actionsDetails}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Assign Grievance to Department
            </h3>
            <p className="text-xs text-slate-600">
              Reference: <strong>{assignModal.grievance?.referenceNumber}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nodal Department
                </label>
                <select
                  required
                  value={assignForm.departmentId}
                  onChange={(e) => setAssignForm({ ...assignForm, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Directive & Specific Instructions for Officer
                </label>
                <textarea
                  rows={3}
                  value={assignForm.instructions}
                  onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })}
                  placeholder="e.g. Conduct field verification within 24 hours and furnish estimate..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2 rounded-lg"
                >
                  {actionLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review ATR Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Review Action-Taken Report
            </h3>
            <div className="p-3 bg-slate-50 rounded border text-xs">
              <span className="font-bold text-slate-800">Officer Report:</span>
              <p className="mt-1 text-slate-600">
                {reviewModal.grievance?.actionTakenReport?.summary || 'No summary'}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CMO Decision
                </label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="APPROVE">Approve Resolution (Mark Grievance Resolved)</option>
                  <option value="REQUEST_REINVESTIGATION">Request Additional Investigation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CMO Secretariat Review Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add administrative review remarks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2 rounded-lg"
                >
                  {actionLoading ? 'Recording...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {escalateModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-red-700 font-serif flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Escalate Grievance to Priority</span>
            </h3>
            <p className="text-xs text-slate-600">
              Escalation will set Priority to <strong>Urgent</strong> and alert department executive leadership.
            </p>

            <form onSubmit={handleEscalateSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                value={escalateRemarks}
                onChange={(e) => setEscalateRemarks(e.target.value)}
                placeholder="Reason for ministerial escalation (e.g. repeated public petitions, SLA elapsed)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalateModal({ open: false, grievance: null })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-5 py-2 rounded-lg"
                >
                  {actionLoading ? 'Escalating...' : 'Confirm Escalation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
