import React, { useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
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
        <title>{t('contact')} | JANASEVA AI</title>
      </Head>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {t('contactBadge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          {t('contactTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 font-serif mb-6">
            {t('contactFormTitle')}
          </h2>

          {statusMessage.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('yourName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sreekumar Nair"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('yourEmail')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. citizen@example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('subjectLabel')} *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief summary of enquiry"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('messageLabel')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your detailed query or feedback here..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? t('submittingBtn') : t('submitEnquiryBtn')}</span>
            </button>
          </form>
        </div>

        {/* Secretarial Contact Cards */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base font-serif text-amber-300">
              {t('contactInfoTitle')}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">{t('secretariatLocTitle')}</p>
                  <p className="text-slate-400 text-2xs mt-0.5 leading-relaxed">
                    {t('secretariatLocDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">{t('cmCallCentre')}</p>
                  <p className="text-slate-400 text-2xs mt-0.5">{t('callCentreHours')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">cmo.grievance@kerala.gov.in</p>
                  <p className="text-slate-400 text-2xs mt-0.5">{t('emailResponseHours')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
              {t('hotlinesTitle')}
            </h4>
            <div className="space-y-2 text-xs text-emerald-950 font-medium">
              <p>• {t('kwaHelpline')}</p>
              <p>• {t('ksebHelpline')}</p>
              <p>• {t('emergencyHelpline')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
