import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FileText,
  Hash,
  ShieldAlert,
  Building2,
  Search,
  FileCheck2,
  CheckCircle,
  RotateCcw,
  Star,
  ArrowDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      num: 1,
      title: t('howStage1Title'),
      role: t('howStage1Role'),
      desc: t('howStage1Desc'),
      icon: FileText,
      badge: 'Step 1'
    },
    {
      num: 2,
      title: t('howStage2Title'),
      role: t('howStage2Role'),
      desc: t('howStage2Desc'),
      icon: Hash,
      badge: 'Step 2'
    },
    {
      num: 3,
      title: t('howStage3Title'),
      role: t('howStage3Role'),
      desc: t('howStage3Desc'),
      icon: ShieldAlert,
      badge: 'Step 3'
    },
    {
      num: 4,
      title: t('howStage4Title'),
      role: t('howStage4Role'),
      desc: t('howStage4Desc'),
      icon: Building2,
      badge: 'Step 4'
    },
    {
      num: 5,
      title: t('howStage5Title'),
      role: t('howStage5Role'),
      desc: t('howStage5Desc'),
      icon: Search,
      badge: 'Step 5'
    },
    {
      num: 6,
      title: t('howStage6Title'),
      role: t('howStage6Role'),
      desc: t('howStage6Desc'),
      icon: FileCheck2,
      badge: 'Step 6'
    },
    {
      num: 7,
      title: t('howStage7Title'),
      role: t('howStage7Role'),
      desc: t('howStage7Desc'),
      icon: CheckCircle,
      badge: 'Step 7'
    },
    {
      num: 8,
      title: t('howStage8Title'),
      role: t('howStage8Role'),
      desc: t('howStage8Desc'),
      icon: Star,
      badge: 'Step 8'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 font-sans">
      <Head>
        <title>{t('howItWorks')} | JANASEVA AI</title>
      </Head>

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {t('howBadge')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
          {t('howMainTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {t('howMainSubtitle')}
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-emerald-500 transition flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {step.badge} • {step.role}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Phase 0{step.num}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-3">
                  <div className="h-6 w-0.5 bg-emerald-200 relative flex items-center justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-700 absolute" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="bg-emerald-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold font-serif">{t('readyToExperience')}</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          {t('readySubtext')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/citizen/submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-lg transition"
          >
            {t('submitActionBtn')}
          </Link>
          <Link
            href="/track"
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-emerald-600 transition"
          >
            {t('trackActionBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
