import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrototypeBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    // 10-second countdown
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-amber-500 text-slate-950 text-xs py-1.5 px-4 font-medium border-b border-amber-600 transition-all duration-500 ease-in-out shadow-sm animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-grow overflow-hidden">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-900" />
          <span className="truncate sm:whitespace-normal">
            <strong>PROTOTYPE DISCLAIMER:</strong> {t('prototypeDisclaimer')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-slate-950 text-amber-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <span>Auto-closes in {secondsLeft}s</span>
          </span>
          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-amber-600 rounded transition text-slate-950"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
