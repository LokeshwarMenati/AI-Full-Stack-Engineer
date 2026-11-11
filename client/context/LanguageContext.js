import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    portalName: 'JANASEVA AI',
    tagline: 'Every Voice Matters. Every Grievance Deserves Action.',
    prototypeDisclaimer: 'RECRUITMENT PROTOTYPE: Fictional demonstration portal inspired by CM Kerala Grievance System for WhiteMatrix Software Solutions evaluation. Not affiliated with Government of Kerala.',
    home: 'Home',
    about: 'About Us',
    howItWorks: 'How It Works',
    departments: 'Departments',
    contact: 'Contact Us',
    faq: 'FAQ',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    dashboard: 'Dashboard',
    submitGrievance: 'Submit Grievance',
    trackGrievance: 'Track Grievance',
    heroTitle: 'Public Grievance Redressal & Citizen Empowerment Platform',
    heroSubtitle: 'Direct, transparent and accountable governance powered by intelligent complaint routing and Chief Minister Office oversight.',
    submitActionBtn: 'File a New Grievance',
    trackActionBtn: 'Track Complaint Status',
    totalComplaints: 'Total Grievances',
    resolvedComplaints: 'Resolved Grievances',
    resolutionRate: 'Resolution Rate',
    activeDepartments: 'Active Departments',
    enterReferenceNumber: 'Enter Grievance Reference Number (e.g. KGR-2026-100001)',
    trackNow: 'Track Status',
    cmoAdminPortal: 'CMO Command Center',
    officerPortal: 'Department Officer Desk',
    languageToggle: 'മലയാളം'
  },
  ml: {
    portalName: 'ജനസേവ AI',
    tagline: 'ഓരോ ശബ്ദവും മുഖ്യം. ഓരോ പരാതിക്കും നീതി.',
    prototypeDisclaimer: 'മാതൃകാ പ്രോട്ടോടൈപ്പ്: വൈറ്റ്‌മാട്രിക്സ് സോഫ്റ്റ്‌വെയർ സൊല്യൂഷൻസ് മൂല്യനിർണ്ണയത്തിനായുള്ള സാങ്കൽപ്പിക പ്ലാറ്റ്‌ഫോം. കേരള സർക്കാരുമായി നേരിട്ട് ബന്ധമില്ല.',
    home: 'ഹോം',
    about: 'ഞങ്ങളെക്കുറിച്ച്',
    howItWorks: 'പ്രവർത്തന രീതി',
    departments: 'വകുപ്പുകൾ',
    contact: 'ബന്ധപ്പെടുക',
    faq: 'ചോദ്യോത്തരങ്ങൾ',
    login: 'പ്രവേശിക്കുക',
    register: 'രജിസ്റ്റർ ചെയ്യുക',
    logout: 'പുറത്തുകടക്കുക',
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    submitGrievance: 'പരാതി നൽകുക',
    trackGrievance: 'പരാതി പരിശോധിക്കുക',
    heroTitle: 'മുഖ്യമന്ത്രിയുടെ ജനസമ്പർക്ക പൊതുജന പരാതി പരിഹാര പോർട്ടൽ',
    heroSubtitle: 'സുതാര്യവും ഉത്തരവാദിത്തമുള്ളതുമായ ഭരണനിർവ്വഹണം, നിർമ്മിത ബുദ്ധി വഴിയുള്ള വേഗത്തിലുള്ള പരാതി പരിഹാരം.',
    submitActionBtn: 'പുതിയ പരാതി സമർപ്പിക്കുക',
    trackActionBtn: 'പരാതിയുടെ അവസ്ഥ അറിയുക',
    totalComplaints: 'ആകെ പരാതികൾ',
    resolvedComplaints: 'പരിഹരിച്ച പരാതികൾ',
    resolutionRate: 'പരിഹാര നിരക്ക്',
    activeDepartments: 'പ്രവർത്തന വകുപ്പുകൾ',
    enterReferenceNumber: 'പരാതി നമ്പർ രേഖപ്പെടുത്തുക (ഉദാ: KGR-2026-100001)',
    trackNow: 'പരിശോധിക്കുക',
    cmoAdminPortal: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസ് കൺട്രോൾ റൂം',
    officerPortal: 'വകുപ്പ് ഉദ്യോഗസ്ഥ ഡെസ്ക്',
    languageToggle: 'English'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('janaseva_lang');
    if (saved && (saved === 'en' || saved === 'ml')) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ml' : 'en';
    setLang(nextLang);
    localStorage.setItem('janaseva_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

