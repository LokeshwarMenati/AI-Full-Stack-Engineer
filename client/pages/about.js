import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Target, Compass, Award, CheckCircle2, Users, FileCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <Head>
        <title>{t('aboutTitle')} | JANASEVA AI</title>
      </Head>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {t('aboutBadge')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
          {t('aboutTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t('aboutSubtitle')}
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">{t('visionTitle')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('visionDesc')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">{t('missionTitle')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('missionDesc')}
          </p>
        </div>
      </div>

      {/* Primary Objectives */}
      <div className="bg-slate-100 p-8 sm:p-10 rounded-2xl border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-6 text-center">
          {t('objectivesTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">{t('obj1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('obj1Desc')}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">{t('obj2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('obj2Desc')}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">{t('obj3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('obj3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Citizen Service Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-serif text-center">
          {t('principlesTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">01</span>
            <h4 className="font-bold text-sm text-slate-900">{t('p1Title')}</h4>
            <p className="text-xs text-slate-600">{t('p1Desc')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">02</span>
            <h4 className="font-bold text-sm text-slate-900">{t('p2Title')}</h4>
            <p className="text-xs text-slate-600">{t('p2Desc')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">03</span>
            <h4 className="font-bold text-sm text-slate-900">{t('p3Title')}</h4>
            <p className="text-xs text-slate-600">{t('p3Desc')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-2xl font-bold text-amber-600 font-serif">04</span>
            <h4 className="font-bold text-sm text-slate-900">{t('p4Title')}</h4>
            <p className="text-xs text-slate-600">{t('p4Desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
