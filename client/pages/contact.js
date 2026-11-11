import React, { useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message || 'Thank you! Your enquiry has been received.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit enquiry. Please check your fields.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 font-sans">
      <Head>
        <title>Contact Us | JANASEVA AI Support</title>
      </Head>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Citizen Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          Chief Minister Grievance Support Cell
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have an inquiry, technical feedback, or need assistance filing a grievance? Our support secretariat is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="bg-[#0F4336] text-white p-8 rounded-2xl space-y-6 flex flex-col justify-between shadow-md">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-serif text-white">Central Secretariat Contact</h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Operating hours: Monday to Saturday, 9:00 AM to 5:30 PM (Except official government holidays).
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Chief Minister’s Grievance Redressal Cell, 3rd Floor, North Block, Government Secretariat, Thiruvananthapuram - 695001.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Toll-Free Call Centre: 1076 / 0471-2333812</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>grievance.cmo@kerala.demo</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/80 rounded-xl border border-emerald-800 text-[11px] text-amber-200">
            For urgent emergency life threats or disasters, dial Kerala State Emergency Operations Centre: <strong>112</strong> / <strong>1077</strong>.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-serif">Send an Enquiry or Feedback</h3>

          {statusMessage.text && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Arun Kumar"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. arun@example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is your enquiry regarding?"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your enquiry in detail..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition disabled:opacity-50 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
