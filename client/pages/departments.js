import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Building2, Mail, Phone, Tag, ArrowRight, Search } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/departments')
      .then((data) => {
        if (data.departments) setDepartments(data.departments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    (d.categories && d.categories.some((c) => c.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <Head>
        <title>Nodal Departments | JANASEVA AI</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            State Administration
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-serif">
            Nodal Redressal Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Government departments integrated into the JANASEVA centralized grievance management system.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search department or category..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 bg-white rounded-xl border border-slate-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : filteredDepts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">No departments matching your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => (
            <div
              key={dept._id || dept.code}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.description}
                </p>

                {/* Categories Pills */}
                {dept.categories && dept.categories.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Grievance Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="text-[11px] text-slate-500 space-y-1">
                  {dept.headEmail && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{dept.headEmail}</span>
                    </div>
                  )}
                  {dept.contactPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{dept.contactPhone}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/citizen/submit?dept=${encodeURIComponent(dept.name)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0F4336] hover:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition"
                >
                  <span>Submit Grievance to {dept.code}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
