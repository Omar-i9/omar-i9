export const projects = [
  {
    id: 'taamenn',
    featured: true,
    status: 'ACTIVE',
    statusKey: 'statusActive',
    categoryKey: 'projectCatFootball',
    titleKey: 'projectName',
    subtitleKey: 'taamenSubtitle',
    shortKey: 'taamenShort',
    openKey: 'projectOpenTaamen',
    version: 'v2.0.0',
    image: 'assets/img/tameen-logo.webp',
    imageFallback: 'assets/img/tameen-logo.jpeg',
    pageUrl: 'pages/project-taameen.html',
    liveUrl: 'https://taamenn.com/',
    pagesUrl: 'https://omar-i9.github.io/taamenn/',
    repositoryUrl: 'https://github.com/Omar-i9/taamenn',
    releasesUrl: 'https://github.com/Omar-i9/taamenn/releases',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'IndexedDB', 'PWA'],
    hud: null,
    acquisition: {
      enabled: true,
      url: 'https://taamenn.com/acquisition',
      price: 'USD 4,900',
      negotiable: true
    }
  },
  {
    id: 'ev-telemetry',
    featured: false,
    status: 'BETA',
    statusKey: 'statusBeta',
    categoryKey: 'projectCatEv',
    titleKey: 'evTitle',
    subtitleKey: 'evSubtitle',
    shortKey: 'projectDesc5',
    version: null,
    image: null,
    pageUrl: 'pages/project-ev.html',
    liveUrl: 'https://ev-telemetry-dashboard.onrender.com/',
    repositoryUrl: 'https://github.com/Omar-i9/EV-Telemetry-Dashboard',
    releasesUrl: null,
    technologies: ['Python', 'Flask', 'WebSocket', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    hud: {
      speed: '75',
      soc: '85.0',
      power: '14.5',
      temp: '32'
    }
  }
];

export function getProject(id) {
  return projects.find((item) => item.id === id) || null;
}

export const taamenShowcase = {
  heroLead: {
    ar: 'مساحة كرة قدم حول تنظيم المباريات، التخطيط التكتيكي، الأرشيف، الملف، التنبيهات، وتجربة محلية ثنائية اللغة.',
    en: 'A football workspace built around match organization, tactical planning, archives, profiles, notifications, and a bilingual local-first experience.'
  },
  overview: {
    ar: 'تأمين 2.0 منصة إدارة وتنظيم مباريات تعمل أولًا على جهازك. المنتج الحالي على taamenn.com هو TAAMEN 2.0 (v2.0.0).',
    en: 'TAAMEN 2.0 is a football management and match-organization platform that stays local-first on the device. The current product on taamenn.com is TAAMEN 2.0 (v2.0.0).'
  },
  architectureLayers: [
    { ar: 'واجهة المستخدم', en: 'UI' },
    { ar: 'صفحات ومكوّنات', en: 'Pages / Components' },
    { ar: 'خدمات ومستودعات', en: 'Services / Repositories' },
    { ar: 'تخزين محلي (IndexedDB)', en: 'Local persistence' },
    { ar: 'PWA والبنية', en: 'PWA / infrastructure' }
  ],
  features: [
    { id: 'match', icon: 'pitch', ar: { name: 'مركز المباراة', line: 'تنظيم المباراة ومتابعتها من مكان واحد.' }, en: { name: 'Match Center', line: 'Match organization in one workspace.' } },
    { id: 'archive', icon: 'archive', ar: { name: 'الأرشيف', line: 'سجل المباريات السابقة للرجوع السريع.' }, en: { name: 'Archive', line: 'Past matches kept for quick recall.' } },
    { id: 'tactical', icon: 'board', ar: { name: 'الملعب التكتيكي', line: 'مساحة تخطيط تكتيكي داخل المنصة.' }, en: { name: 'Tactical Playground', line: 'In-app tactical planning space.' } },
    { id: 'profile', icon: 'user', ar: { name: 'الملف', line: 'صفحة ملف داخل تجربة تأمين.' }, en: { name: 'Profile', line: 'In-product profile experience.' } },
    { id: 'notify', icon: 'bell', ar: { name: 'التنبيهات', line: 'إشعارات داخل التطبيق.' }, en: { name: 'Notifications', line: 'In-app notification center.' } },
    { id: 'settings', icon: 'gear', ar: { name: 'الإعدادات', line: 'ضبط التجربة من داخل المنصة.' }, en: { name: 'Settings', line: 'Product settings inside the app.' } },
    { id: 'support', icon: 'life', ar: { name: 'الدعم', line: 'مسار دعم داخل المنتج.' }, en: { name: 'Support', line: 'In-product support path.' } },
    { id: 'stadiums', icon: 'stadia', ar: { name: 'الملاعب', line: 'وظائف مرتبطة بالملاعب.' }, en: { name: 'Stadiums', line: 'Stadium-related functionality.' } },
    { id: 'i18n', icon: 'lang', ar: { name: 'عربي / إنجليزي', line: 'واجهة ثنائية اللغة.' }, en: { name: 'AR / EN', line: 'Bilingual interface.' } },
    { id: 'local', icon: 'disk', ar: { name: 'محلي أولًا', line: 'IndexedDB على جهاز المستخدم.' }, en: { name: 'Local-first', line: 'IndexedDB on the user device.' } },
    { id: 'pwa', icon: 'app', ar: { name: 'PWA', line: 'بنية تطبيق ويب تقدمي.' }, en: { name: 'PWA', line: 'Progressive web app infrastructure.' } },
    { id: 'share', icon: 'share', ar: { name: 'المشاركة', line: 'مشاركة من داخل تجربة تأمين.' }, en: { name: 'Sharing', line: 'Sharing inside the TAAMEN experience.' } }
  ],
  timeline: [
    {
      tag: 'v1.0.0',
      date: '2026-03-18',
      ar: 'الانتقال من Google Sites إلى GitHub Pages، مع محرك تكتيكي بالسحب والإفلات وأرشيف مباريات.',
      en: 'Left Google Sites for GitHub Pages, with drag-and-drop tactics and a match archive.'
    },
    {
      tag: 'v1.1.2',
      date: '2026-05-08',
      ar: 'إعادة بناء أرشيف المباريات: بطاقات، فلترة، بحث، وتفاصيل إحصائية.',
      en: 'Match archive remake: cards, filters, search, and statistical detail.'
    },
    {
      tag: 'v3.1.0-legacy',
      date: '2026-06-05',
      ar: 'إصدار Legacy Edition لتأمين 2026 — نسخة تاريخية مستقرة، ليست حالة المشروع الحالية.',
      en: 'Legacy Edition of تأمين 2026 — a historical freeze, not the current project state.'
    },
    {
      tag: 'v5.2',
      date: '2026-06-17',
      ar: 'مرحلة تاريخية: إعادة بناء الرادار التكتيكي ومساعد ذكي تجريبي. ليست شبكة ميزات 2.0 الحالية.',
      en: 'Historical phase: tactical radar rebuild and an experimental assistant. Not the current 2.0 feature grid.'
    },
    {
      tag: 'TAAMEN 2.0',
      date: null,
      ar: 'إعادة بناء معمارية: React و TypeScript و Vite و GSAP و IndexedDB و PWA.',
      en: 'Architecture rebuild: React, TypeScript, Vite, GSAP, IndexedDB, and PWA.'
    },
    {
      tag: 'v2.0.0-beta.1',
      date: '2026-09-16',
      ar: 'مرحلة تاريخية: بيتا معلنة بأساس محلي أولًا، قبل المنتج الحالي على taamenn.com.',
      en: 'Historical phase: announced beta with a local-first foundation, before the current product on taamenn.com.'
    },
    {
      tag: 'v2.0.0',
      date: null,
      ar: 'المنتج الحالي: تأمين 2.0 على taamenn.com.',
      en: 'Current product: TAAMEN 2.0 on taamenn.com.'
    }
  ],
  visualsNote: {
    ar: 'لا توجد لقطات شاشة رسمية داخل هذا المستودع الشخصي. الهوية البصرية هنا من شعار تأمين الحقيقي، لا من واجهات مولّدة.',
    en: 'This personal repo has no official TAAMEN screenshots. The visual here is the real TAAMEN mark — not a generated UI fake.'
  }
};

export const evShowcase = {
  overview: {
    ar: 'لوحة تيليمتري لسيارة كهربائية: محاكاة فيزياء بطارية ومحرك، بث WebSocket، تسجيل SQLite، وواجهة HUD. المستودع: EV-Telemetry-Dashboard. التشغيل الحي على Render وقد يتأخر أول فتح.',
    en: 'An EV telemetry dashboard: physics-based battery and motor simulation, WebSocket streaming, SQLite logging, and a HUD interface. Repository: EV-Telemetry-Dashboard. The live Render instance may be slow on first open.'
  },
  highlights: [
    { ar: 'بث حي عبر WebSocket', en: 'Live WebSocket stream' },
    { ar: 'محاكاة بطارية ومحرك', en: 'Battery and motor simulation' },
    { ar: 'تسجيل SQLite', en: 'SQLite logging' },
    { ar: 'واجهة HUD سيارات', en: 'Automotive HUD interface' }
  ],
  note: {
    ar: 'أرقام السرعة والشحن على بطاقة عمر محلية للعرض فقط. صفحة عمر لا تتصل بخادم اللوحة.',
    en: 'Speed and SOC figures on Omar’s card are local presentation values. Omar Profiles does not call the dashboard server.'
  }
};
