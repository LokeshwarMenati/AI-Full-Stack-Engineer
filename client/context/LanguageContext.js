import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation & Branding
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
    languageToggle: 'മലയാളം',
    recruitmentPrototype: 'Recruitment Prototype',
    govPrototype: 'Gov Prototype',
    cmoPortal: 'CMO Portal',
    officerDesk: 'Officer Desk',
    myGrievances: 'My Grievances',

    // Hero Section
    aiBadge: 'Next-Gen Governance • Powered by Google Gemini AI',
    heroTitle: 'Public Grievance Redressal & Citizen Empowerment Platform',
    heroSubtitle: 'Direct, transparent and accountable governance powered by intelligent complaint routing and Chief Minister Office oversight.',
    submitActionBtn: 'File a New Grievance',
    trackActionBtn: 'Track Complaint Status',
    quickTrackPlaceholder: 'Quick Track e.g. KGR-2026-100001',
    trackBtn: 'Track',

    // KPI Stats
    totalComplaints: 'Total Grievances',
    totalComplaintsSub: 'Aggregated across 14 Kerala districts',
    resolvedComplaints: 'Resolved Grievances',
    resolvedComplaintsSub: 'With citizen satisfaction reports',
    resolutionRate: 'Resolution Rate',
    resolutionRateSub: 'SLA compliant redressal average',
    activeDepartments: 'Active Departments',
    activeDepartmentsSub: 'Government nodal departments',

    // Workflow Section
    workflowBadge: 'Transparent Workflow',
    workflowTitle: 'Complete End-to-End Grievance Lifecycle',
    workflowSubtitle: 'Every complaint follows a structured, role-authorized trajectory overseen by the Chief Minister’s Office.',
    step1Title: '1. Citizen Submission',
    step1Desc: 'Citizen submits grievance with details. Google Gemini analyzes text and suggests department and priority instantly.',
    step2Title: '2. CMO Administrative Review',
    step2Desc: 'CMO secretariat evaluates AI recommendations, sets SLA timeline, and assigns to the nodal department officer.',
    step3Title: '3. Field Investigation',
    step3Desc: 'Designated department officer conducts field investigation, logs progress remarks, and files the Action-Taken Report.',
    step4Title: '4. Resolution & Feedback',
    step4Desc: 'CMO approves resolution. Citizen receives SMS/in-app notification and rates satisfaction or can reopen if unaddressed.',
    exploreWorkflowBtn: 'Explore Detailed 8-Stage Architecture',

    // Featured Departments Section
    deptsBadge: 'Public Administration',
    deptsTitle: 'Key Redressal Departments',
    viewAllDepts: 'View All 8 Departments',
    activeRedressal: 'Active Redressal',
    fileGrievanceArrow: 'File Grievance →',

    // Privacy & Security Section
    securityBadge: 'Citizen Privacy & Security First',
    securityTitle: 'Protected by Cloudflare Turnstile & SVG Image Verification',
    securityDesc: 'Every grievance submission is shielded with dual-layer bot protection, encrypted data handling, and privacy masking. Public tracking never exposes citizen identity or personal phone numbers.',
    fileVerifiedGrievanceBtn: 'File Verified Grievance',
    learnServicePrinciplesBtn: 'Learn About Service Principles',

    // Footer
    footerDesc: 'An intelligent, transparent, AI-assisted public grievance redressal system prototype inspired by the Government of Kerala Chief Minister’s Public Grievance Redressal framework.',
    footerEvalNote: 'Evaluation Prototype: Created for WhiteMatrix Software Solutions machine test evaluation. Fictional demonstration portal.',
    civicNavTitle: 'Civic Navigation',
    rolePortalsTitle: 'Role Portals & APIs',
    citizenGrievancePortal: 'Citizen Grievance Portal',
    cmoAdminPortal: 'CMO Administration Command',
    officerPortal: 'Department Officer Desk',
    swaggerDocs: 'Swagger OpenAPI Docs',
    dualSecuredNote: 'Cloudflare Turnstile & SVG CAPTCHA Dual Secured',
    hotlinesTitle: 'Public Utility Hotlines',
    cmCallCentre: 'CM Public Grievance Call Centre: 1076',
    kwaHelpline: 'Water Authority Helpline: 1916',
    ksebHelpline: 'KSEB Electricity Outage: 1912',
    emergencyHelpline: 'Emergency Services: 112',
    secretariatAddress: 'Government Secretariat, Thiruvananthapuram, Kerala',
    footerCopyright: '© 2026 JANASEVA AI Platform. Designed according to Government of India Digital Service Guidelines (GIGW) & WCAG 2.2 AA.',
    machineTestSub: 'Candidate Recruitment Machine Test Submission',

    // About Us Page
    aboutBadge: 'Governance & Ethics',
    aboutTitle: 'About JANASEVA AI',
    aboutSubtitle: 'Inspired by the Chief Minister’s Public Grievance Redressal Portal (CM Kerala), JANASEVA AI establishes an intelligent bridge between citizens and state administrative machinery.',
    visionTitle: 'Our Vision',
    visionDesc: 'To build an inclusive, equitable, and transparent civic ecosystem where every citizen voice is promptly heard, intelligently classified, and redressed by designated authorities within strict time-bound SLAs.',
    missionTitle: 'Our Mission',
    missionDesc: 'Harnessing state-of-the-art AI language models to minimize bureaucratic delays, eliminate duplicate complaints, route civic issues directly to field officers, and maintain complete auditability through CMO executive supervision.',
    objectivesTitle: 'Key Strategic Objectives',
    obj1Title: 'Zero Administrative Blindspots',
    obj1Desc: 'Real-time aggregation pipelines track overdue grievances across all 14 districts with instant escalation warnings.',
    obj2Title: 'AI-Guided Categorization',
    obj2Desc: 'Google Gemini language model classifies grievances to appropriate departments while preserving citizen privacy.',
    obj3Title: 'Citizen Centric Accountability',
    obj3Desc: 'Every status change is immutable. Citizens can track progress publicly and reopen grievances if redressal is substandard.',
    principlesTitle: 'Citizen-Focused Service Principles',
    p1Title: 'Universal Accessibility',
    p1Desc: 'English and Malayalam bilingual support adhering to WCAG 2.2 AA.',
    p2Title: 'Privacy by Design',
    p2Desc: 'Public tracking masks personal identifiers and phone numbers.',
    p3Title: 'Time-Bound Redressal',
    p3Desc: 'Configurable SLA deadlines from 24 hours for urgent to 96 hours.',
    p4Title: 'Democratic Feedback',
    p4Desc: 'Post-resolution rating and comments directly impact departmental metrics.',

    // How It Works Page
    howBadge: 'Workflow Architecture',
    howMainTitle: 'Grievance Lifecycle from Submission to Resolution',
    howMainSubtitle: 'A completely traceable 8-stage redressal process ensuring total transparency and ministerial oversight.',
    howStage1Title: 'Citizen Submission & AI Assistance',
    howStage1Role: 'Citizen & AI Assistant',
    howStage1Desc: 'Citizen inputs district, subject, and description. Google Gemini analyzes the complaint in real time to recommend the proper department, category, and priority before final submission.',
    howStage2Title: 'Safe Reference ID Generation',
    howStage2Role: 'Backend Core Engine',
    howStage2Desc: 'A tamper-proof unique tracking ID is generated safely on the server in KGR-YYYY-NNNNNN format (e.g. KGR-2026-100001). Initial immutable history record is logged.',
    howStage3Title: 'CMO Secretariat Review & SLA Setting',
    howStage3Role: 'Chief Minister’s Office (CMO)',
    howStage3Desc: 'CMO administrative officers review the AI categorization, examine duplicate warnings, set mandatory SLA countdowns, and can escalate delayed issues.',
    howStage4Title: 'Department & Officer Assignment',
    howStage4Role: 'CMO to Department Officer',
    howStage4Desc: 'Grievance moves to "Under Review" or "In Progress" and is assigned directly to the relevant nodal department (e.g. PWD, KWA, Health) and designated assistant executive engineer.',
    howStage5Title: 'Field Investigation & Progress Updates',
    howStage5Role: 'Department Field Officer',
    howStage5Desc: 'The assigned officer visits the site, assesses ground conditions, updates investigation remarks, and attaches work estimates. Citizen is notified automatically.',
    howStage6Title: 'Action-Taken Report (ATR) Submission',
    howStage6Role: 'Department Officer',
    howStage6Desc: 'Officer concludes physical rectification (e.g. pipeline replacement, road patching) and submits a comprehensive Action-Taken Report with AI summary to the CMO.',
    howStage7Title: 'CMO Review & Final Approval',
    howStage7Role: 'Chief Minister’s Office (CMO)',
    howStage7Desc: 'CMO administrator audits the submitted action report. They approve the final resolution or demand further field investigation if civic standards are not met.',
    howStage8Title: 'Citizen Notification & Democratic Feedback',
    howStage8Role: 'Citizen Redressal Closure',
    howStage8Desc: 'Status transitions to "Resolved". Citizen rates service timeliness and quality (1-5 stars). If ground issue persists, citizen can reopen the complaint with explanation.',
    readyToExperience: 'Ready to Experience Seamless Civic Redressal?',
    readySubtext: 'Submit your concern directly to the Chief Minister’s Office or track an existing complaint.',

    // Departments Page
    deptsPageBadge: 'State Administration',
    deptsPageTitle: 'Nodal Redressal Departments',
    deptsPageSubtitle: 'Government departments integrated into the JANASEVA centralized grievance management system.',
    searchDeptPlaceholder: 'Search department or category...',
    noDeptFound: 'No departments matching your search query.',
    hodLabel: 'Head of Dept',
    nodalEmailLabel: 'Nodal Email',
    nodalPhoneLabel: 'Helpline',
    mandateLabel: 'Civic Mandate Categories',

    // Contact Page
    contactBadge: 'Citizen Helpdesk',
    contactTitle: 'Chief Minister Grievance Support Cell',
    contactSubtitle: 'Have questions, need technical assistance, or wish to follow up on an urgent emergency? Reach our 24/7 dedicated secretariat grievance cell.',
    contactFormTitle: 'Send an Official Enquiry',
    yourName: 'Full Name',
    yourEmail: 'Official Email Address',
    subjectLabel: 'Subject of Enquiry',
    messageLabel: 'Detailed Message',
    submittingBtn: 'Submitting Enquiry...',
    submitEnquiryBtn: 'Submit Enquiry',
    contactInfoTitle: 'Direct Secretarial Contacts',
    secretariatLocTitle: 'Central Secretariat',
    secretariatLocDesc: 'CM Grievance Redressal Cell, 4th Floor, North Block, Government Secretariat, Thiruvananthapuram, Kerala – 695001',
    callCentreHours: 'Toll-free 24/7 Citizen Redressal Line',
    emailResponseHours: 'Direct secretariat assistance (24h response)',

    // FAQ Page
    faqBadge: 'Help & Guidance',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about submitting, tracking, and resolving grievances on JANASEVA AI.',

    // Track Page
    trackBadge: 'Public Verification',
    trackPageTitle: 'Official Grievance Redressal Tracker',
    trackPageSubtitle: 'Track your complaint live through all 8 stages of ministerial and departmental investigation.',
    enterRefLabel: 'Enter Grievance Reference ID',
    searchTrackBtn: 'Track Grievance',
    searchingTrackBtn: 'Searching Redressal Records...',
    privacyMaskNotice: 'Privacy Protected: Citizen phone number and personal details are redacted from public tracking view.',
    complaintSummaryTitle: 'Grievance Summary',
    statusHistoryTitle: 'Redressal Timeline & Audit Trail',
    actionTakenTitle: 'Action-Taken Report (ATR)',
    reopenGrievanceBtn: 'Reopen Complaint',
    feedbackTitle: 'Rate Grievance Redressal Experience',
    ratePrompt: 'How satisfied are you with the resolution timeliness and department action?',
    submitRatingBtn: 'Submit Rating & Feedback',

    // Statuses
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusReopened: 'Reopened',

    // Login & Register
    loginTitle: 'Access Grievance Redressal Portal',
    loginSubtitle: 'Citizens, CMO administrators and Department Officers sign in securely.',
    registerTitle: 'Create New Citizen Account',
    registerSubtitle: 'Register with dual CAPTCHA bot protection to submit and track civic grievances.',
    emailPlaceholder: 'Enter your email address',
    passwordPlaceholder: 'Enter your account password',
    fullNamePlaceholder: 'Enter your full name',
    phonePlaceholder: 'Enter 10-digit mobile number',
    quickFillTitle: 'One-Click Evaluator Credentials',
    citizenRoleDemo: 'Citizen Demo',
    cmoRoleDemo: 'CMO Admin Demo',
    officerRoleDemo: 'Department Officer Demo',
    turnstileSecured: 'Cloudflare Turnstile Verified',
    imageCaptchaLabel: 'Security Verification (Image CAPTCHA)',
    enterCaptchaChars: 'Type the 4 characters above',
    refreshCaptcha: 'Refresh challenge'
  },
  ml: {
    // Navigation & Branding
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
    languageToggle: 'English',
    recruitmentPrototype: 'റിക്രൂട്ട്മെന്റ് മാതൃക',
    govPrototype: 'ഭരണ മാതൃക',
    cmoPortal: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസ്',
    officerDesk: 'ഉദ്യോഗസ്ഥ ഡെസ്ക്',
    myGrievances: 'എന്റെ പരാതികൾ',

    // Hero Section
    aiBadge: 'ആധുനിക ഭരണം • ഗൂഗിൾ ജെമിനി AI പിന്തുണയോടെ',
    heroTitle: 'മുഖ്യമന്ത്രിയുടെ ജനസമ്പർക്ക പൊതുജന പരാതി പരിഹാര പോർട്ടൽ',
    heroSubtitle: 'സുതാര്യവും ഉത്തരവാദിത്തമുള്ളതുമായ ഭരണനിർവ്വഹണം, ബുദ്ധിപരമായ പരാതി വിഭജനം, മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ നേരിട്ടുള്ള മേൽനോട്ടം.',
    submitActionBtn: 'പുതിയ പരാതി സമർപ്പിക്കുക',
    trackActionBtn: 'പരാതിയുടെ അവസ്ഥ അറിയുക',
    quickTrackPlaceholder: 'പരാതി നമ്പർ രേഖപ്പെടുത്തുക (ഉദാ: KGR-2026-100001)',
    trackBtn: 'പരിശോധിക്കുക',

    // KPI Stats
    totalComplaints: 'ആകെ പരാതികൾ',
    totalComplaintsSub: '14 കേരള ജില്ലകളിലായി ലഭിച്ച പരാതികൾ',
    resolvedComplaints: 'പരിഹരിച്ച പരാതികൾ',
    resolvedComplaintsSub: 'പൗരന്മാരുടെ സംതൃപ്തി രേഖപ്പെടുത്തിയത്',
    resolutionRate: 'പരിഹാര നിരക്ക്',
    resolutionRateSub: 'കൃത്യസമയത്ത് പരിഹരിച്ച ശരാശരി',
    activeDepartments: 'പ്രവർത്തന വകുപ്പുകൾ',
    activeDepartmentsSub: 'സംസ്ഥാന സർക്കാർ വകുപ്പുകൾ',

    // Workflow Section
    workflowBadge: 'സുതാര്യമായ പ്രവർത്തന രീതി',
    workflowTitle: 'പരാതി സമർപ്പണം മുതൽ പരിഹാരം വരെയുള്ള ഘട്ടങ്ങൾ',
    workflowSubtitle: 'ഓരോ പരാതിയും മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ നേരിട്ടുള്ള മേൽനോട്ടത്തിൽ മുൻഗണനാടിസ്ഥാനത്തിൽ കൈകാര്യം ചെയ്യുന്നു.',
    step1Title: '1. പരാതി സമർപ്പണം',
    step1Desc: 'പൗരന്മാർ വിവരങ്ങൾ രേഖപ്പെടുത്തുന്നു. ഗൂഗിൾ ജെമിനി AI പരാതി പരിശോധിച്ച് വകുപ്പും മുൻഗണനയും നിർദ്ദേശിക്കുന്നു.',
    step2Title: '2. മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ പരിശോധന',
    step2Desc: 'CMO ഉദ്യോഗസ്ഥർ AI ശുപാർശകൾ പരിശോധിച്ച് സമയപരിധി നിശ്ചയിച്ച് ബന്ധപ്പെട്ട വകുപ്പിന് കൈമാറുന്നു.',
    step3Title: '3. ഫീൽഡ് തല അന്വേഷണം',
    step3Desc: 'വകുപ്പ് ഉദ്യോഗസ്ഥൻ സ്ഥലം സന്ദർശിച്ച് പരിശോധന നടത്തുകയും നടപടി റിപ്പോർട്ട് (ATR) തയ്യാറാക്കുകയും ചെയ്യുന്നു.',
    step4Title: '4. പരിഹാരവും അഭിപ്രായവും',
    step4Desc: 'CMO പരിഹാരം അംഗീകരിക്കുന്നു. പൗരന്മാർക്ക് അറിയിപ്പ് ലഭിക്കുകയും സംതൃപ്തി റേറ്റിംഗ് രേഖപ്പെടുത്തുകയും ചെയ്യാം.',
    exploreWorkflowBtn: 'വിശദമായ 8 ഘട്ടങ്ങൾ കാണുക',

    // Featured Departments Section
    deptsBadge: 'പൊതുഭരണം',
    deptsTitle: 'പ്രധാന പരാതി പരിഹാര വകുപ്പുകൾ',
    viewAllDepts: 'എല്ലാ 8 വകുപ്പുകളും കാണുക',
    activeRedressal: 'സജീവ പരിഹാരം',
    fileGrievanceArrow: 'പരാതി നൽകുക →',

    // Privacy & Security Section
    securityBadge: 'പൗരന്മാരുടെ സ്വകാര്യതയും സുരക്ഷയും പ്രധാനം',
    securityTitle: 'ക്ലൗഡ്ഫ്ലെയർ ടേൺസ്റ്റൈൽ & ഇമേജ് ക്യാപ്ച സുരക്ഷ',
    securityDesc: 'ഓരോ പരാതി സമർപ്പണവും ഇരട്ട-പാളി ബോട്ട് സംരക്ഷണവും ഡാറ്റാ എൻക്രിപ്ഷനും കൊണ്ട് സുരക്ഷിതമാണ്. പൊതു ട്രാക്കിംഗിൽ വ്യക്തിഗത ഫോൺ നമ്പറുകൾ ഒരിക്കലും വെളിപ്പെടുത്തുകയില്ല.',
    fileVerifiedGrievanceBtn: 'പരിശോധിച്ചുറപ്പിച്ച പരാതി നൽകുക',
    learnServicePrinciplesBtn: 'സേവന തത്വങ്ങൾ മനസ്സിലാക്കുക',

    // Footer
    footerDesc: 'കേരള മുഖ്യമന്ത്രിയുടെ പൊതുജന പരാതി പരിഹാര സംവിധാനത്തിൽ നിന്ന് പ്രചോദനം ഉൾക്കൊണ്ട് നിർമ്മിച്ച ആധുനിക AI അസിസ്റ്റഡ് പ്ലാറ്റ്‌ഫോം.',
    footerEvalNote: 'മൂല്യനിർണ്ണയ പ്രോട്ടോടൈപ്പ്: വൈറ്റ്‌മാട്രിക്സ് സോഫ്റ്റ്‌വെയർ സൊല്യൂഷൻസ് പരീക്ഷയ്ക്കായി തയ്യാറാക്കിയത്.',
    civicNavTitle: 'പ്രധാന ലിങ്കുകൾ',
    rolePortalsTitle: 'പോർട്ടലുകൾ & API',
    citizenGrievancePortal: 'പൗരന്മാരുടെ പരാതി പോർട്ടൽ',
    cmoAdminPortal: 'മുഖ്യമന്ത്രിയുടെ കൺട്രോൾ റൂം',
    officerPortal: 'വകുപ്പ് ഉദ്യോഗസ്ഥ ഡെസ്ക്',
    swaggerDocs: 'Swagger API രേഖകൾ',
    dualSecuredNote: 'ക്ലൗഡ്ഫ്ലെയർ & ഇമേജ് ക്യാപ്ച ഇരട്ട സുരക്ഷിതം',
    hotlinesTitle: 'അടിയന്തര സേവന നമ്പറുകൾ',
    cmCallCentre: 'മുഖ്യമന്ത്രിയുടെ പരാതി പരിഹാര കോൾ സെന്റർ: 1076',
    kwaHelpline: 'വാട്ടർ അതോറിറ്റി ഹെൽപ്പ്‌ലൈൻ: 1916',
    ksebHelpline: 'കെ.എസ്.ഇ.ബി വൈദ്യുതി തടസ്സം: 1912',
    emergencyHelpline: 'അടിയന്തര പോലീസ്/ആംബുലൻസ്: 112',
    secretariatAddress: 'ഗവൺമെന്റ് സെക്രട്ടേറിയറ്റ്, തിരുവനന്തപുരം, കേരളം',
    footerCopyright: '© 2026 ജനസേവ AI പ്ലാറ്റ്‌ഫോം. കേന്ദ്ര-സംസ്ഥാന ഡിജിറ്റൽ സേവന മാനദണ്ഡങ്ങൾ അനുസരിച്ച് തയ്യാറാക്കിയത്.',
    machineTestSub: 'റിക്രൂട്ട്മെന്റ് മെഷീൻ ടെസ്റ്റ് സമർപ്പണം',

    // About Us Page
    aboutBadge: 'ഭരണവും മൂല്യങ്ങളും',
    aboutTitle: 'ജനസേവ AI-യെക്കുറിച്ച്',
    aboutSubtitle: 'കേരള മുഖ്യമന്ത്രിയുടെ പൊതുജന പരാതി പരിഹാര പോർട്ടലിൽ നിന്ന് പ്രചോദനം ഉൾക്കൊണ്ട് നിർമ്മിച്ച ആധുനിക ഭരണ സമ്പർക്ക വേദി.',
    visionTitle: 'ഞങ്ങളുടെ ലക്ഷ്യം',
    visionDesc: 'എല്ലാ പൗരന്മാരുടെയും ശബ്ദം വേഗത്തിൽ കേൾക്കുകയും നിശ്ചിത സമയപരിധിക്കുള്ളിൽ പൂർണ്ണമായും പരിഹരിക്കപ്പെടുകയും ചെയ്യുന്ന സുതാര്യമായ ഭരണ സംവിധാനം.',
    missionTitle: 'ഞങ്ങളുടെ ദൗത്യം',
    missionDesc: 'ഉദ്യോഗസ്ഥ തല കാലതാമസങ്ങൾ ഒഴിവാക്കി കൃത്യമായ ഉദ്യോഗസ്ഥരിലേക്ക് പരാതികൾ എത്തിക്കുന്നതിനായി ആധുനിക AI സാങ്കേതികവിദ്യ പ്രയോജനപ്പെടുത്തുന്നു.',
    objectivesTitle: 'പ്രധാന ലക്ഷ്യങ്ങൾ',
    obj1Title: 'പൂർണ്ണ സുതാര്യത',
    obj1Desc: '14 ജില്ലകളിലുമുള്ള പരാതികൾ തത്സമയം നിരീക്ഷിക്കുകയും സമയപരിധി കഴിഞ്ഞവ ഉടൻ മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ ശ്രദ്ധയിൽപ്പെടുത്തുകയും ചെയ്യുന്നു.',
    obj2Title: 'AI സഹായത്തോടെയുള്ള തരംതിരിക്കൽ',
    obj2Desc: 'ഗൂഗിൾ ജെമിനി മോഡൽ വ്യക്തിഗത വിവരങ്ങളുടെ സ്വകാര്യത കാത്തുസൂക്ഷിച്ചുകൊണ്ട് പരാതികൾ കൃത്യമായ വകുപ്പിലേക്ക് തിരിച്ചുവിടുന്നു.',
    obj3Title: 'ഉത്തരവാദിത്തമുള്ള ഭരണം',
    obj3Desc: 'ഓരോ ഘട്ടവും മാറ്റമില്ലാതെ രേഖപ്പെടുത്തുന്നു. പരാതി തൃപ്തികരമല്ലെങ്കിൽ വീണ്ടും തുറക്കാനുള്ള അവകാശം പൗരന്മാർക്ക് നൽകുന്നു.',
    principlesTitle: 'പൗരകേന്ദ്രീകൃത സേവന തത്വങ്ങൾ',
    p1Title: 'എല്ലാവർക്കും പ്രാപ്യം',
    p1Desc: 'ഇംഗ്ലീഷ്, മലയാളം ഭാഷാ സൗകര്യവും WCAG 2.2 AA നിഷ്കർഷിക്കുന്ന ഡിജിറ്റൽ ലഭ്യതയും.',
    p2Title: 'പൂർണ്ണ സ്വകാര്യത',
    p2Desc: 'പൊതു ട്രാക്കിംഗിൽ വ്യക്തിഗത വിവരങ്ങളും ഫോൺ നമ്പറുകളും മറച്ചുവെക്കപ്പെടുന്നു.',
    p3Title: 'സമയബന്ധിത പരിഹാരം',
    p3Desc: 'അടിയന്തര പരാതികൾക്ക് 24 മണിക്കൂർ മുതൽ പരമാവധി 96 മണിക്കൂർ വരെയുള്ള സമയപരിധി.',
    p4Title: 'ജനാധിപത്യ അഭിപ്രായങ്ങൾ',
    p4Desc: 'പരിഹാരത്തിന് ശേഷമുള്ള റേറ്റിംഗും അഭിപ്രായങ്ങളും വകുപ്പുകളുടെ പ്രവർത്തനക്ഷമത വിലയിരുത്താൻ ഉപയോഗിക്കുന്നു.',

    // How It Works Page
    howBadge: 'പ്രവർത്തന രൂപരേഖ',
    howMainTitle: 'പരാതി സമർപ്പണം മുതൽ പരിഹാരം വരെയുള്ള 8 ഘട്ടങ്ങൾ',
    howMainSubtitle: 'പൂർണ്ണ സുതാര്യതയും മുഖ്യമന്ത്രിയുടെ നേരിട്ടുള്ള മേൽനോട്ടവും ഉറപ്പാക്കുന്ന കൃത്യമായ ഭരണനിർവ്വഹണ പ്രക്രിയ.',
    howStage1Title: 'പൗര സമർപ്പണവും AI സഹായവും',
    howStage1Role: 'പൗരനും AI സഹായിയും',
    howStage1Desc: 'പൗരൻ ജില്ലയും വിഷയവും പരാതി വിവരണവും നൽകുന്നു. ഗൂഗിൾ ജെമിനി AI തത്സമയം പരിശോധിച്ച് അനുയോജ്യമായ വകുപ്പും മുൻഗണനയും നിർദ്ദേശിക്കുന്നു.',
    howStage2Title: 'സുരക്ഷിത റഫറൻസ് നമ്പർ നിർമ്മാണം',
    howStage2Role: 'ബാക്കെൻഡ് കോർ സിസ്റ്റം',
    howStage2Desc: 'മാറ്റങ്ങൾ വരുത്താനാകാത്ത സുരക്ഷിതമായ ട്രാക്കിംഗ് ഐഡി KGR-YYYY-NNNNNN ഫോർമാറ്റിൽ സെർവറിൽ സുരക്ഷിതമായി നിർമ്മിക്കപ്പെടുന്നു.',
    howStage3Title: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ അവലോകനം',
    howStage3Role: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസ് (CMO)',
    howStage3Desc: 'CMO അഡ്മിനിസ്ട്രേറ്റർമാർ AI ശുപാർശകൾ പരിശോധിക്കുകയും സമയപരിധി (SLA) നിശ്ചയിക്കുകയും ആവശ്യമെങ്കിൽ അടിയന്തര നടപടിക്ക് നിർദ്ദേശിക്കുകയും ചെയ്യുന്നു.',
    howStage4Title: 'വകുപ്പ്-ഉദ്യോഗസ്ഥ ചുമതലപ്പെടുത്തൽ',
    howStage4Role: 'CMO വകുപ്പ് ഉദ്യോഗസ്ഥനിലേക്ക്',
    howStage4Desc: 'പരാതി ബന്ധപ്പെട്ട നോഡൽ വകുപ്പിലേക്കും (ഉദാ: PWD, വാട്ടർ അതോറിറ്റി, ആരോഗ്യം) അസിസ്റ്റന്റ് എക്സിക്യൂട്ടീവ് എഞ്ചിനീയർക്കും നേരിട്ട് കൈമാറുന്നു.',
    howStage5Title: 'ഫീൽഡ് പരിശോധനയും തത്സമയ വിവരങ്ങളും',
    howStage5Role: 'വകുപ്പ് ഫീൽഡ് ഉദ്യോഗസ്ഥൻ',
    howStage5Desc: 'ചുമതലപ്പെടുത്തിയ ഉദ്യോഗസ്ഥൻ സ്ഥലം സന്ദർശിച്ച് സ്ഥിതിഗതികൾ വിലയിരുത്തുകയും പുരോഗതി വിവരങ്ങൾ സിസ്റ്റത്തിൽ രേഖപ്പെടുത്തുകയും ചെയ്യുന്നു.',
    howStage6Title: 'നടപടി റിപ്പോർട്ട് (ATR) സമർപ്പണം',
    howStage6Role: 'വകുപ്പ് ഉദ്യോഗസ്ഥൻ',
    howStage6Desc: 'പ്രശ്ന പരിഹാര ജോലികൾ പൂർത്തിയാക്കിയ ശേഷം ഉദ്യോഗസ്ഥൻ വിശദമായ നടപടി റിപ്പോർട്ടും ഫോട്ടോകളും സഹിതം CMO-യ്ക്ക് സമർപ്പിക്കുന്നു.',
    howStage7Title: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസിന്റെ അന്തിമ അംഗീകാരം',
    howStage7Role: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസ് (CMO)',
    howStage7Desc: 'CMO ഉദ്യോഗസ്ഥൻ സമർപ്പിക്കപ്പെട്ട റിപ്പോർട്ട് സമഗ്രമായി പരിശോധിക്കുന്നു. മാനദണ്ഡങ്ങൾ പാലിച്ചിട്ടുണ്ടെങ്കിൽ അന്തിമ പരിഹാരം അംഗീകരിക്കുന്നു.',
    howStage8Title: 'പൗര അറിയിപ്പും റേറ്റിംഗും',
    howStage8Role: 'പൗര സംതൃപ്തി സ്ഥിരീകരണം',
    howStage8Desc: 'പരാതി "പരിഹരിച്ചു" എന്ന അവസ്ഥയിലേക്ക് മാറുന്നു. പൗരന്മാർക്ക് 1 മുതൽ 5 സ്റ്റാർ വരെ റേറ്റിംഗ് നൽകാം. പരിഹാരത്തിൽ തൃപ്തിയില്ലെങ്കിൽ വീണ്ടും തുറക്കാം.',
    readyToExperience: 'സുതാര്യമായ പരാതി പരിഹാര സേവനം പ്രയോജനപ്പെടുത്തൂ',
    readySubtext: 'നിങ്ങളുടെ പ്രശ്നങ്ങൾ മുഖ്യമന്ത്രിയുടെ ഓഫീസിന് നേരിട്ട് സമർപ്പിക്കുക അല്ലെങ്കിൽ നിലവിലെ പരാതി പരിശോധിക്കുക.',

    // Departments Page
    deptsPageBadge: 'സംസ്ഥാന ഭരണം',
    deptsPageTitle: 'നോഡൽ പരാതി പരിഹാര വകുപ്പുകൾ',
    deptsPageSubtitle: 'ജനസേവ കേന്ദ്രീകൃത പരാതി പരിഹാര സംവിധാനവുമായി ബന്ധിപ്പിച്ചിട്ടുള്ള സർക്കാർ വകുപ്പുകൾ.',
    searchDeptPlaceholder: 'വകുപ്പോ വിഭാഗമോ തിരയുക...',
    noDeptFound: 'നിങ്ങൾ തിരഞ്ഞ വിവരങ്ങളുമായി പൊരുത്തപ്പെടുന്ന വകുപ്പുകളില്ല.',
    hodLabel: 'വകുപ്പ് മേധാവി',
    nodalEmailLabel: 'ഇമെയിൽ വിലാസം',
    nodalPhoneLabel: 'ഹെൽപ്പ്‌ലൈൻ നമ്പർ',
    mandateLabel: 'പ്രധാന ചുമതലകൾ',

    // Contact Page
    contactBadge: 'പൗര സഹായ കേന്ദ്രം',
    contactTitle: 'മുഖ്യമന്ത്രിയുടെ പരാതി പരിഹാര സഹായ സെൽ',
    contactSubtitle: 'സാങ്കേതിക സഹായത്തിനോ അടിയന്തര അന്വേഷണങ്ങൾക്കോ 24/7 പ്രവർത്തിക്കുന്ന സെക്രട്ടേറിയറ്റ് സഹായ സെല്ലുമായി ബന്ധപ്പെടാം.',
    contactFormTitle: 'ഔദ്യോഗിക സന്ദേശം അയക്കുക',
    yourName: 'പൂർണ്ണ പേര്',
    yourEmail: 'ഇമെയിൽ വിലാസം',
    subjectLabel: 'വിഷയം',
    messageLabel: 'വിശദമായ സന്ദേശം',
    submittingBtn: 'സന്ദേശം അയക്കുന്നു...',
    submitEnquiryBtn: 'സന്ദേശം അയക്കുക',
    contactInfoTitle: 'നേരിട്ടുള്ള കോൺടാക്റ്റുകൾ',
    secretariatLocTitle: 'സെൻട്രൽ സെക്രട്ടേറിയറ്റ്',
    secretariatLocDesc: 'സി.എം പരാതി പരിഹാര സെൽ, നാലാം നില, നോർത്ത് ബ്ലോക്ക്, ഗവൺമെന്റ് സെക്രട്ടേറിയറ്റ്, തിരുവനന്തപുരം, കേരളം – 695001',
    callCentreHours: 'ടോൾ-ഫ്രീ 24/7 പൗര സഹായ ലൈൻ',
    emailResponseHours: 'നേരിട്ടുള്ള സെക്രട്ടേറിയറ്റ് സഹായം (24 മണിക്കൂറിനകം മറുപടി)',

    // FAQ Page
    faqBadge: 'സഹായവും മാർഗ്ഗനിർദ്ദേശവും',
    faqTitle: 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ)',
    faqSubtitle: 'ജനസേവ AI പോർട്ടലിൽ പരാതി സമർപ്പിക്കുന്നതിനും നിരീക്ഷിക്കുന്നതിനും ആവശ്യമായ എല്ലാ വിവരങ്ങളും.',

    // Track Page
    trackBadge: 'പൊതു പരിശോധന',
    trackPageTitle: 'പരാതി പരിഹാര ട്രാക്കർ',
    trackPageSubtitle: 'മുഖ്യമന്ത്രിയുടെ ഓഫീസും വകുപ്പുകളും നടത്തുന്ന അന്വേഷണ പുരോഗതി 8 ഘട്ടങ്ങളിലായി തത്സമയം അറിയാം.',
    enterRefLabel: 'പരാതി റഫറൻസ് നമ്പർ രേഖപ്പെടുത്തുക',
    searchTrackBtn: 'പരാതി പരിശോധിക്കുക',
    searchingTrackBtn: 'രേഖകൾ പരിശോധിക്കുന്നു...',
    privacyMaskNotice: 'സ്വകാര്യതാ സംരക്ഷണം: പൗരന്റെ ഫോൺ നമ്പറും വ്യക്തിഗത വിവരങ്ങളും പൊതു ട്രാക്കിംഗിൽ മറച്ചുവെച്ചിരിക്കുന്നു.',
    complaintSummaryTitle: 'പരാതി സംഗ്രഹം',
    statusHistoryTitle: 'നടപടി ക്രമങ്ങളുടെ വിവരങ്ങൾ',
    actionTakenTitle: 'നടപടി റിപ്പോർട്ട് (ATR)',
    reopenGrievanceBtn: 'പരാതി വീണ്ടും തുറക്കുക',
    feedbackTitle: 'പരാതി പരിഹാര അനുഭവ റേറ്റിംഗ്',
    ratePrompt: 'ലഭിച്ച സേവനത്തിന്റെ സമയബന്ധിതതയിലും ഗുണനിലവാരത്തിലും നിങ്ങൾ എത്രത്തോളം സംതൃപ്തനാണ്?',
    submitRatingBtn: 'റേറ്റിംഗും അഭിപ്രായവും സമർപ്പിക്കുക',

    // Statuses
    statusSubmitted: 'സമർപ്പിച്ചു',
    statusUnderReview: 'പരിശോധനയിൽ',
    statusInProgress: 'നടപടിയിൽ',
    statusResolved: 'പരിഹരിച്ചു',
    statusReopened: 'വീണ്ടും തുറന്നു',

    // Login & Register
    loginTitle: 'പരാതി പരിഹാര പോർട്ടലിലേക്ക് പ്രവേശിക്കുക',
    loginSubtitle: 'പൗരന്മാർക്കും CMO ഉദ്യോഗസ്ഥർക്കും വകുപ്പ് ഉദ്യോഗസ്ഥർക്കും സുരക്ഷിതമായി പ്രവേശിക്കാം.',
    registerTitle: 'പുതിയ പൗര അക്കൗണ്ട് തുറക്കുക',
    registerSubtitle: 'ഇരട്ട ക്യാപ്ച ബോട്ട് സംരക്ഷണത്തോടെ അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്ത് പരാതികൾ സമർപ്പിക്കുക.',
    emailPlaceholder: 'ഇമെയിൽ വിലാസം നൽകുക',
    passwordPlaceholder: 'പാസ്‌വേഡ് നൽകുക',
    fullNamePlaceholder: 'പൂർണ്ണ പേര് നൽകുക',
    phonePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക',
    quickFillTitle: 'മൂല്യനിർണ്ണയത്തിനായുള്ള ഡെമോ അക്കൗണ്ടുകൾ',
    citizenRoleDemo: 'പൗരൻ ഡെമോ',
    cmoRoleDemo: 'CMO അഡ്മിൻ ഡെമോ',
    officerRoleDemo: 'വകുപ്പ് ഉദ്യോഗസ്ഥൻ ഡെമോ',
    turnstileSecured: 'ക്ലൗഡ്ഫ്ലെയർ ടേൺസ്റ്റൈൽ പരിശോധിച്ചുറപ്പിച്ചു',
    imageCaptchaLabel: 'സുരക്ഷാ പരിശോധന (ഇമേജ് ക്യാപ്ച)',
    enterCaptchaChars: 'മുകളിൽ കാണുന്ന 4 അക്ഷരങ്ങൾ ടൈപ്പ് ചെയ്യുക',
    refreshCaptcha: 'ക്യാപ്ച പുതുക്കുക'
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
