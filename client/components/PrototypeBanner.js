import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrototypeBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-500 text-slate-950 text-xs py-1.5 px-4 font-medium border-b border-amber-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-900" />
          <span>
            <strong>PROTOTYPE DISCLAIMER:</strong> {t('prototypeDisclaimer')}
          </span>
        </div>
        <span className="hidden md:inline-block bg-slate-950 text-amber-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
          Recruitment Prototype
        </span>
      </div>
    </div>
  );
}

