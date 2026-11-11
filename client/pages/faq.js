import React, { useState } from 'react';
import Head from 'next/head';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const { lang, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState(0);

  const faqsEn = [
    {
      q: 'How do I register as a citizen on JANASEVA AI?',
      a: 'Click on the "Sign Up" button on the top menu. Enter your Full Name, Email Address, Mobile Number, and Password. Complete the two mandatory verification challenges: Cloudflare Turnstile and the Image CAPTCHA. Upon submitting, your account is immediately verified and active.'
    },
    {
      q: 'What is the format of the Grievance Reference Number and how is it generated?',
      a: 'Every grievance receives an immutable, server-generated reference number formatted as KGR-YYYY-NNNNNN (for instance: KGR-2026-100001). This format guarantees year-wise uniqueness and prevents sequential tampering.'
    },
    {
      q: 'How does the Google Gemini AI Assistant help during grievance submission?',
      a: 'As you type your complaint subject and description, Google Gemini evaluates the contextual text, redacts sensitive personal phone/email information, and recommends the appropriate nodal department (e.g. Water Resources, PWD, Electricity), category, and priority level. You can review and edit these recommendations before submitting.'
    },
    {
      q: 'Can anyone view my personal information using the public tracking tool?',
      a: 'No. To strictly preserve citizen privacy, the public tracking tool masks all personal information (such as your name and email address) and hides confidential internal administrative notes. Only authorized CMO administrators and the citizen owner can view complete unmasked details.'
    },
    {
      q: 'What are the five mandatory statuses a grievance moves through?',
      a: 'The five statuses are: 1. Submitted (received from citizen), 2. Under Review (screened by CMO secretariat), 3. In Progress (field officer investigating/rectifying), 4. Resolved (ATR approved by CMO), and 5. Reopened (citizen requests reinvestigation due to recurring ground issues).'
    },
    {
      q: 'What happens if my grievance is not resolved within the promised timeframe?',
      a: 'Every grievance has a calculated SLA deadline (24 hours for Urgent, 48 hours for High, 96 hours for Medium). If this deadline lapses, the system flags the complaint as "Overdue", visually alerting CMO administrators to escalate the grievance directly to senior department leadership.'
    },
    {
      q: 'How do I provide feedback or reopen a resolved complaint?',
      a: 'Once your grievance reaches "Resolved" status, navigate to your Citizen Dashboard or the Tracking page. You will see an interactive 5-star rating widget to evaluate timeliness and officer conduct. If the issue was not satisfactorily resolved, you can click "Reopen Grievance" with an explanation.'
    },
    {
      q: 'Is this portal officially affiliated with the Government of Kerala?',
      a: 'No. JANASEVA AI is a recruitment machine test demonstration prototype developed for WhiteMatrix Software Solutions evaluation. All data, departments, and credentials presented are purely fictional demonstration records.'
    }
  ];

  const faqsMl = [
    {
      q: 'ജനസേവ AI-യിൽ എങ്ങനെയാണ് പൗരനായി രജിസ്റ്റർ ചെയ്യുന്നത്?',
      a: 'മുകളിലെ മെനുവിലെ "രജിസ്റ്റർ ചെയ്യുക" ബട്ടണിൽ ക്ലിക്കുചെയ്യുക. പേര്, ഇമെയിൽ വിലാസം, മൊബൈൽ നമ്പർ, പാസ്‌വേഡ് എന്നിവ നൽകുക. ക്ലൗഡ്ഫ്ലെയർ ടേൺസ്റ്റൈൽ, ഇമേജ് ക്യാപ്ച എന്നീ രണ്ട് സുരക്ഷാ പരിശോധനകൾ പൂർത്തിയാക്കുക. സമർപ്പിച്ച ഉടൻ നിങ്ങളുടെ അക്കൗണ്ട് സജീവമാകും.'
    },
    {
      q: 'പരാതി റഫറൻസ് നമ്പറിന്റെ ഫോർമാറ്റ് എന്താണ്, അത് എങ്ങനെ നിർമ്മിക്കപ്പെടുന്നു?',
      a: 'ഓരോ പരാതിക്കും KGR-YYYY-NNNNNN ഫോർമാറ്റിൽ (ഉദാഹരണത്തിന്: KGR-2026-100001) സുരക്ഷിതമായ റഫറൻസ് നമ്പർ സെർവർ വഴി നിർമ്മിക്കപ്പെടുന്നു. ഇത് തട്ടിപ്പുകൾ തടയുകയും ഓരോ പരാതിക്കും വ്യതിരിക്തമായ ഐഡി നൽകുകയും ചെയ്യുന്നു.'
    },
    {
      q: 'പരാതി നൽകുമ്പോൾ ഗൂഗിൾ ജെമിനി AI സഹായി എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
      a: 'നിങ്ങൾ പരാതി വിവരങ്ങൾ ടൈപ്പ് ചെയ്യുമ്പോൾ, ഗൂഗിൾ ജെമിനി AI പരാതി പരിശോധിച്ച് വ്യക്തിഗത വിവരങ്ങൾ സുരക്ഷിതമാക്കി അനുയോജ്യമായ വകുപ്പ്, വിഭാഗം, മുൻഗണന എന്നിവ നിർദ്ദേശിക്കുന്നു. സമർപ്പിക്കുന്നതിന് മുൻപ് നിങ്ങൾക്ക് ഇവ മാറ്റാവുന്നതാണ്.'
    },
    {
      q: 'പൊതു ട്രാക്കിംഗ് സംവിധാനത്തിലൂടെ മറ്റുള്ളവർക്ക് എന്റെ സ്വകാര്യ വിവരങ്ങൾ കാണാൻ കഴിയുമോ?',
      a: 'ഇല്ല. പൗരന്മാരുടെ സ്വകാര്യത സംരക്ഷിക്കുന്നതിനായി, പൊതു ട്രാക്കിംഗിൽ പേരും ഫോൺ നമ്പറും പൂർണ്ണമായി മറയ്ക്കപ്പെടുന്നു. ഔദ്യോഗിക ഭരണാധികാരികൾക്കും പരാതിക്കാരനും മാത്രമേ പൂർണ്ണ വിവരങ്ങൾ കാണാൻ സാധിക്കൂ.'
    },
    {
      q: 'പരാതി കടന്നുപോകുന്ന 5 പ്രധാന ഘട്ടങ്ങൾ ഏതൊക്കെയാണ്?',
      a: '1. സമർപ്പിച്ചു (Submitted), 2. പരിശോധനയിൽ (Under Review), 3. നടപടിയിൽ (In Progress), 4. പരിഹരിച്ചു (Resolved), 5. വീണ്ടും തുറന്നു (Reopened) എന്നിവയാണ് അഞ്ച് ഘട്ടങ്ങൾ.'
    },
    {
      q: 'നിശ്ചിത സമയപരിധിക്കുള്ളിൽ പരാതി പരിഹരിച്ചില്ലെങ്കിൽ എന്ത് സംഭവിക്കും?',
      a: 'ഓരോ പരാതിക്കും നിശ്ചിത സമയപരിധി (SLA) ഉണ്ട് (അടിയന്തര പരാതികൾക്ക് 24 മണിക്കൂർ മുതൽ 96 മണിക്കൂർ വരെ). സമയം കഴിഞ്ഞാൽ സിസ്റ്റം "Overdue" ആയി അടയാളപ്പെടുത്തുകയും CMO അഡ്മിനിസ്ട്രേറ്റർമാർക്ക് നേരിട്ട് മുന്നറിയിപ്പ് നൽകുകയും ചെയ്യുന്നു.'
    },
    {
      q: 'പരിഹരിച്ച പരാതിക്ക് എങ്ങനെ റേറ്റിംഗ് നൽകാം അല്ലെങ്കിൽ വീണ്ടും തുറക്കാം?',
      a: 'പരാതി "പരിഹരിച്ചു" എന്ന അവസ്ഥയിലെത്തിയാൽ, ഡാഷ്‌ബോർഡിലോ ട്രാക്കിംഗ് പേജിലോ 5-സ്റ്റാർ റേറ്റിംഗ് നൽകാം. പ്രശ്നം പൂർണ്ണമായി പരിഹരിച്ചില്ലെങ്കിൽ കാരണം വ്യക്തമാക്കി "പരാതി വീണ്ടും തുറക്കുക" വഴി പുനരന്വേഷണം ആവശ്യപ്പെടാം.'
    },
    {
      q: 'ഈ പോർട്ടൽ കേരള സർക്കാരുമായി ഔദ്യോഗികമായി ബന്ധമുള്ളതാണോ?',
      a: 'അല്ല. ജനസേവ AI എന്നത് വൈറ്റ്‌മാട്രിക്സ് സോഫ്റ്റ്‌വെയർ സൊല്യൂഷൻസ് മെഷീൻ ടെസ്റ്റ് മൂല്യനിർണ്ണയത്തിനായി വികസിപ്പിച്ചെടുത്ത ഒരു സാങ്കൽപ്പിക റിക്രൂട്ട്മെന്റ് മാതൃകയാണ്.'
    }
  ];

  const faqs = lang === 'ml' ? faqsMl : faqsEn;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <Head>
        <title>{t('faq')} | JANASEVA AI</title>
      </Head>

      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {t('faqBadge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          {t('faqTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('faqSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                    {faq.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
