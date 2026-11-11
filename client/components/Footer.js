import React from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A2E25] text-slate-300 border-t-4 border-amber-500 font-sans">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Disclaimer */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900 border border-amber-500/40 flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight font-serif">
                  {t('portalName')}
                </span>
                <p className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                  Governance Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An intelligent, transparent, AI-assisted public grievance redressal system prototype inspired by the Government of Kerala Chief Minister’s Public Grievance Redressal framework.
            </p>
            <div className="p-3 bg-emerald-950/80 rounded border border-emerald-900 text-[11px] text-amber-200/90">
              <strong>Evaluation Prototype:</strong> Created for WhiteMatrix Software Solutions machine test evaluation. Fictional demonstration portal.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Civic Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-amber-400 transition">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-amber-400 transition">
                  {t('departments')}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-400 transition">
                  {t('trackGrievance')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Access Roles */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Role Portals & APIs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citizen/dashboard" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Citizen Grievance Portal
                </Link>
              </li>
              <li>
                <Link href="/cmo/dashboard" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> CMO Administration Command
                </Link>
              </li>
              <li>
                <Link href="/officer/dashboard" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Department Officer Desk
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300 font-mono text-[11px]"
                >
                  Swagger OpenAPI Docs <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1">
                  Cloudflare Turnstile & SVG CAPTCHA Dual Secured
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: State Demonstration Helplines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Public Utility Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>CM Public Grievance Call Centre: 1076</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Water Authority Helpline: 1916</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>KSEB Electricity Outage: 1912</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Emergency Services: 112</span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>grievance.cmo@kerala.demo</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Government Secretariat, Thiruvananthapuram, Kerala</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#061F19] py-4 px-4 sm:px-6 lg:px-8 border-t border-emerald-950 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 JANASEVA AI Platform. Designed according to Government of India Digital Service Guidelines (GIGW) & WCAG 2.2 AA.
          </p>
          <p className="text-[11px] text-amber-400 font-mono">
            Candidate Recruitment Machine Test Submission
          </p>
        </div>
      </div>
    </footer>
  );
}

