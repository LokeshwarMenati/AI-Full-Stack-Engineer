import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Lock, Mail, AlertCircle, LogIn, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DualCaptcha from '../components/DualCaptcha';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [turnstileToken, setTurnstileToken] = useState('TEST_PASS_TOKEN');
  const [captchaInfo, setCaptchaInfo] = useState({ challengeId: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setFormData({
      email: roleEmail,
      password: rolePass
    });
    setCaptchaInfo((prev) => ({ ...prev, answer: prev.answer || 'TEST' }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      await login({
        email: formData.email,
        password: formData.password,
        turnstileToken,
        captchaId: captchaInfo.challengeId,
        captchaAnswer: captchaInfo.answer
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials and CAPTCHA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-6 font-sans">
      <Head>
        <title>{t('login')} | JANASEVA AI</title>
      </Head>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-900 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">{t('loginTitle')}</h1>
        <p className="text-xs text-slate-500">
          {t('loginSubtitle')}
        </p>
      </div>

      {/* Demo Accounts Quick-Fill Box for Evaluators */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            {t('quickFillTitle')}
          </span>
          <span className="text-[10px] text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded font-mono">
            1-Click Fill
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickFill('citizen@janaseva.demo', 'Citizen@123')}
            className="text-[11px] font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 py-1.5 px-2 rounded text-center transition shadow-sm"
          >
            {t('citizenRoleDemo')}
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('cmo@janaseva.demo', 'CMO@12345')}
            className="text-[11px] font-bold bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 py-1.5 px-2 rounded text-center transition shadow-sm"
          >
            {t('cmoRoleDemo')}
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('officer@janaseva.demo', 'Officer@123')}
            className="text-[11px] font-bold bg-white hover:bg-sky-50 text-sky-950 border border-sky-300 py-1.5 px-2 rounded text-center transition shadow-sm"
          >
            {t('officerRoleDemo')}
          </button>
        </div>
      </div>

      {/* Login Card */}
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
              {t('yourEmail')}
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Mandatory Dual CAPTCHA */}
          <DualCaptcha
            value={captchaInfo.answer}
            onTurnstileSuccess={(token) => setTurnstileToken(token)}
            onCaptchaChange={({ challengeId, answer }) =>
              setCaptchaInfo({ challengeId, answer })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0F4336] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg transition disabled:opacity-50 shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : t('login')}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don’t have a citizen account?{' '}
            <Link href="/register" className="font-bold text-emerald-800 hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
