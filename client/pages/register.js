import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DualCaptcha from '../components/DualCaptcha';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [turnstileToken, setTurnstileToken] = useState('TEST_PASS_TOKEN');
  const [captchaInfo, setCaptchaInfo] = useState({ challengeId: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the Cloudflare Turnstile security check.');
      return;
    }

    if (!captchaInfo.answer) {
      setError('Please enter the Image CAPTCHA characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        turnstileToken,
        captchaId: captchaInfo.challengeId,
        captchaAnswer: captchaInfo.answer
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-6 font-sans">
      <Head>
        <title>{t('register')} | JANASEVA AI</title>
      </Head>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-900 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">{t('registerTitle')}</h1>
        <p className="text-xs text-slate-500">
          {t('registerSubtitle')}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('yourName')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('fullNamePlaceholder')}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('yourEmail')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('emailPlaceholder')}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number (10 digits) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                placeholder={t('phonePlaceholder')}
                maxLength={10}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Dual CAPTCHA */}
          <DualCaptcha
            onTurnstileSuccess={(token) => setTurnstileToken(token)}
            onCaptchaChange={({ challengeId, answer }) =>
              setCaptchaInfo({ challengeId, answer })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg transition disabled:opacity-50 shadow-md"
          >
            {loading ? 'Registering Account...' : t('register')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-emerald-800 hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
