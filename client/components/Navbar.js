import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, Menu, X, Globe, User, LogOut, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const router = useRouter();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'cmo_admin') return '/cmo/dashboard';
    if (user.role === 'officer') return '/officer/dashboard';
    return '/citizen/dashboard';
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/how-it-works', label: t('howItWorks') },
    { href: '/departments', label: t('departments') },
    { href: '/track', label: t('trackGrievance') },
    { href: '/contact', label: t('contact') },
    { href: '/faq', label: t('faq') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F4336] text-white shadow-md border-b border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-lg bg-emerald-900/80 border border-amber-500/40 flex items-center justify-center p-2 shadow-inner group-hover:border-amber-400 transition">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  {t('portalName')}
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                  {t('govPrototype')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 tracking-wide font-sans hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-900 text-amber-300 font-semibold'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Submit, User Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-emerald-700 hover:bg-emerald-800 text-emerald-200 hover:text-white transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('languageToggle')}</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 px-3.5 py-2 rounded-md text-sm font-semibold border border-amber-500/30 transition shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {user.role === 'cmo_admin'
                      ? t('cmoPortal')
                      : user.role === 'officer'
                      ? t('officerDesk')
                      : t('myGrievances')}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-emerald-200 hover:text-red-400 hover:bg-emerald-900/50 rounded-md transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-md text-sm font-medium text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/citizen/submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-md text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('submitGrievance')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs border border-emerald-700 rounded text-emerald-200"
            >
              {t('languageToggle')}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2E25] border-t border-emerald-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-900 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-emerald-900/80 space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-md"
                >
                  Go to {user.role === 'cmo_admin' ? 'CMO Dashboard' : user.role === 'officer' ? 'Officer Dashboard' : 'Citizen Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center border border-emerald-700 text-emerald-200 hover:text-white px-4 py-2.5 rounded-md"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/citizen/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-md"
                >
                  {t('submitGrievance')}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center border border-emerald-700 text-emerald-200 px-4 py-2.5 rounded-md"
                >
                  {t('login')} / Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

