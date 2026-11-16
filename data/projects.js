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
    version: 'v2.0.0',
    image: 'assets/img/tameen-logo.webp',
    imageFallback: 'assets/img/tameen-logo.jpeg',
    liveUrl: 'https://taamenn.com/',
    pageUrl: 'pages/project-taameen.html',
    capabilities: { live: true, repository: false, caseStudy: true },
    technologies: ['React', 'TypeScript', 'Vite', 'IndexedDB', 'PWA', 'Cloudflare Workers', 'D1', 'Workers AI'],
    hud: null
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
    capabilities: { live: true, repository: true, caseStudy: true },
    technologies: ['Python', 'Flask', 'WebSocket', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    hud: { speed: '75', soc: '85.0', power: '14.5', temp: '32' }
  }
];

export function getProject(id) {
  return projects.find((item) => item.id === id) || null;
}

export function hasCapability(project, capability) {
  if (!project) return false;
  const caps = project.capabilities;
  if (caps && Object.prototype.hasOwnProperty.call(caps, capability)) return Boolean(caps[capability]);
  if (capability === 'live') return Boolean(project.liveUrl);
  if (capability === 'repository') return Boolean(project.repositoryUrl);
  if (capability === 'caseStudy') return Boolean(project.pageUrl);
  return false;
}

export const taamenShowcase = {
  heroLead: {
    ar: 'منصة كرة قدم تجمع تنظيم المباريات، الأرشيف، التخطيط التكتيكي، الملاعب، الملف الشخصي والمساعد الذكي ضمن مساحة واحدة.',
    en: 'A football workspace bringing match organization, archives, tactical planning, stadiums, profiles, and an AI assistant together.'
  },
  overview: {
    ar: 'تأمين منصة لإدارة وتنظيم مباريات كرة القدم. النسخة المنشورة التي يمكن للزائر استخدامها هي TAAMEN 2.0 بإصدار المنتج v2.0.0. أما حزم V20–V21.5 فهي سجل تطوير منفصل؛ لا يصح اعتبارها كلها منشورة على الإنتاج.',
    en: 'TAAMEN is a football match-management workspace. The visitor-facing live product is TAAMEN 2.0, product version v2.0.0. V20–V21.5 are a separate development record and should not be described as fully deployed to production.'
  },
  productStatus: {
    ar: 'متاح على الموقع الرسمي · الإصدار المنشور 2.0.0',
    en: 'Available on the official site · Published product version 2.0.0'
  },
  features: [
    { id: 'match', icon: 'pitch', ar: { name: 'مركز المباريات', line: 'إنشاء المباريات وتنظيم تفاصيلها ومتابعة النتائج.' }, en: { name: 'Match Center', line: 'Create matches, organize details, and follow results.' } },
    { id: 'archive', icon: 'archive', ar: { name: 'الأرشيف', line: 'الاحتفاظ بالمباريات السابقة والرجوع إلى تفاصيلها.' }, en: { name: 'Archive', line: 'Keep previous matches and revisit their details.' } },
    { id: 'tactical', icon: 'board', ar: { name: 'الملعب التكتيكي', line: 'تخطيط 5v5 و7v7، توزيع اللاعبين ورسم التحركات.' }, en: { name: 'Tactical Playground', line: '5v5 and 7v7 planning, player placement, and movement drawing.' } },
    { id: 'stadiums', icon: 'stadia', ar: { name: 'الملاعب', line: 'حفظ الملاعب وربطها بإنشاء المباريات.' }, en: { name: 'Stadiums', line: 'Save venues and connect them to match creation.' } },
    { id: 'profile', icon: 'user', ar: { name: 'الملف الشخصي', line: 'إدارة بيانات الحساب وتجربة الملف داخل التطبيق.' }, en: { name: 'Profile', line: 'Manage account details and the in-app profile experience.' } },
    { id: 'ai', icon: 'app', ar: { name: 'المساعد الذكي', line: 'مساعد كرة قدم سياقي ضمن حدود استخدام وموافقة واضحة.' }, en: { name: 'TAAMEN AI', line: 'A context-aware football assistant with explicit consent and usage limits.' } },
    { id: 'notify', icon: 'bell', ar: { name: 'التنبيهات', line: 'تذكيرات وإشعارات مرتبطة بنشاط التطبيق.' }, en: { name: 'Notifications', line: 'Reminders and notifications connected to app activity.' } },
    { id: 'local', icon: 'disk', ar: { name: 'حفظ محلي أولاً', line: 'العمل محلياً مع مسار مزامنة سحابي اختياري عند تفعيله.' }, en: { name: 'Local-first storage', line: 'Work locally, with an optional cloud-sync track when enabled.' } },
    { id: 'share', icon: 'share', ar: { name: 'المشاركة والتصدير', line: 'مشاركة تفاصيل مختارة وتصدير البيانات المدعومة.' }, en: { name: 'Sharing and export', line: 'Share selected details and export supported data.' } },
    { id: 'i18n', icon: 'lang', ar: { name: 'عربي / إنجليزي', line: 'واجهة تدعم RTL وLTR.' }, en: { name: 'Arabic / English', line: 'An interface supporting RTL and LTR.' } }
  ],
  timeline: [
    { tag: 'V20', date: '2026-11-12', ar: 'تطوير مسار مزامنة للمباريات مرتبط بالحساب الموثّق، وموافقة صريحة، وصندوق عمليات محلي، ومعالجة تعارضات الإصدارات. بقي النشر الإنتاجي غير مثبت.', en: 'Developed verified-account match sync with explicit consent, a local outbox, and revision-aware conflict handling. Production deployment was not established.' },
    { tag: 'V21', date: '2026-11-12', ar: 'تحسين تحويل إحداثيات اللمس والسحب في الملعب التكتيكي، وإعادة تصميم الملف والحساب، وتحسين الجولة التفاعلية وقائمة اللغة.', en: 'Improved tactical-board touch and drag coordinate mapping, refreshed profile/account surfaces, and refined the guided tour and language menu.' },
    { tag: 'V21.1', date: '2026-11-12', ar: 'تصحيح تشخيص Cloud Preview لتمييز رفض 401 المتوقع للزائر غير المسجل عن أعطال الخدمة، وفصل إعداد المعاينة عن الإنتاج.', en: 'Corrected Cloud Preview diagnostics to distinguish the expected signed-out 401 from service failures, and separated preview from production configuration.' },
    { tag: 'V21.2', date: '2026-11-12', ar: 'تحديث الهوية الرسمية وصفحات الخصوصية والشروط، ومواءمة إصدار الموافقة القانونية إلى 2.5. بقي مزودا البريد وGoogle معطلين حتى إعداد الأسرار.', en: 'Refreshed official branding and privacy/terms pages, and aligned legal consent to version 2.5. Email and Google providers remained disabled pending secrets configuration.' },
    { tag: 'Mobile UX Patch', date: '2026-11-12', ar: 'تحسينات استجابة للجوال في المصادقة، وشريط أدوات الملعب التكتيكي، ودرج الإعدادات، ومساحات الأمان. تقرير الباتش يذكر أن تشغيل Playwright البصري كان معدّاً ولم يُنفذ.', en: 'Responsive refinements for authentication, the tactical toolbar, settings drawer, and safe areas. The patch report says the Playwright visual run was prepared but not executed.' },
    { tag: 'V21.5', date: '2026-11-12', ar: 'سجل التطوير الذي شاركته وثّق 412/412 فحصاً ناجحاً، لكن بقي خطأ TypeScript في Assistant.tsx، كما لم تكن أزرار التحقق بالبريد وتسجيل Google تعمل. النجاح في الاختبارات لا يعني اعتماد الإصدار.', en: 'The development run you shared recorded 412/412 passing checks, but a TypeScript error remained in Assistant.tsx and email-verification / Google sign-in buttons were still not working. Passing tests did not certify the release.' }
  ],
  developmentStatus: {
    ar: [
      'تُعرض مراحل V20–V21.5 كتطورات مصدرية واختبارات، لا كميزات منشورة تلقائياً على الموقع الحي.',
      'مزامنة المباريات مبنية بمبدأ الحساب الموثق والموافقة، لكن تفعيل Cloud Sync ظل مغلقاً افتراضياً في إعداد المعاينة.',
      'مسارات OTP وGoogle OAuth موجودة برمجياً، لكن إعدادات V21.2 أظهرت أن المزوّدين DISABLED في Preview. يلزم إعداد الأسرار وإعادة اختبار الأزرار في المتصفح.',
      'خطأ Assistant.tsx وجولة Playwright البصرية غير المنفذة كانا بوابتَي اعتماد مستقلتين في السجل المتاح.'
    ],
    en: [
      'V20–V21.5 are shown as source and test milestones, not as automatically deployed live features.',
      'Match sync was built around verified accounts and explicit consent, while Preview Cloud Sync remained disabled by default.',
      'OTP and Google OAuth routes exist in source, but V21.2 reported both providers DISABLED in Preview. Secrets setup and browser testing of the buttons are still required.',
      'The Assistant.tsx error and the unrun Playwright visual pass remained separate release gates in the available record.'
    ]
  },
  unannouncedTrack: {
    ar: [
      { title: 'سلسلة احتياط للمساعد الذكي', detail: 'تصوّر لتوجيه الطلب بين Workers AI والمساعد الحالي ثم بديل محلي عند تعطل الاتصال؛ ما زال اتجاهاً هندسياً قيد الدراسة وليس ميزة متاحة.' },
      { title: 'نظام التسديدات والأهداف', detail: 'تصميم مقترح لأداة Shot & Goal داخل الملعب التكتيكي، مع حفظ المسار وتمييز الهدف؛ لم يُعلن كتطبيق مكتمل.' },
      { title: 'توسعة عمق الخطط التكتيكية', detail: 'تحسين حفظ تفاصيل المسارات والمنحنيات والأدوات بين 5v5 و7v7، مع المحافظة على التوافق مع الخطط السابقة.' },
      { title: 'توسعة المزامنة', detail: 'دراسة نقل أنواع إضافية من بيانات مساحة العمل بعد تثبيت الحساب الموثق وحدود الخصوصية والموافقة.' }
    ],
    en: [
      { title: 'Assistant fallback chain', detail: 'A proposed routing path from Workers AI to the existing assistant and then a local fallback during outages. This is an engineering direction, not an available feature.' },
      { title: 'Shot & Goal system', detail: 'A proposed Tactical Playground tool for drawing shots, preserving paths, and identifying goals. It has not been announced as a completed implementation.' },
      { title: 'Deeper tactical-plan persistence', detail: 'Improve storage of routes, curves, and tools across 5v5 and 7v7 while preserving older plans.' },
      { title: 'Broader synchronization', detail: 'Explore synchronizing more workspace data after verified identity, privacy boundaries, and consent are stable.' }
    ]
  },
  architectureLayers: [
    { ar: 'واجهة وتجربة استخدام', en: 'Interface and experience' },
    { ar: 'صفحات ومكوّنات', en: 'Pages and components' },
    { ar: 'خدمات ومستودعات بيانات', en: 'Services and repositories' },
    { ar: 'IndexedDB وحفظ محلي', en: 'IndexedDB and local persistence' },
    { ar: 'PWA وCloudflare', en: 'PWA and Cloudflare infrastructure' }
  ],
  note: {
    ar: 'التفاصيل الداخلية هنا ملخصة على مستوى المنتج. لا تتضمن الصفحة أسراراً أو مفاتيح أو بيانات حسابات أو روابط إعدادات خاصة.',
    en: 'Internal details are summarized at product level. This page does not expose secrets, keys, account data, or private configuration URLs.'
  }
};

export const evShowcase = {
  overview: {
    ar: 'لوحة تيليمتري لسيارة كهربائية: محاكاة بطارية ومحرك، بث WebSocket، تسجيل SQLite، وواجهة HUD. التشغيل على Render وقد يتأخر أول فتح.',
    en: 'An EV telemetry dashboard with battery and motor simulation, WebSocket streaming, SQLite logging, and a HUD. The Render instance may take longer on its first load.'
  },
  highlights: [
    { ar: 'بث حي عبر WebSocket', en: 'Live WebSocket stream' },
    { ar: 'محاكاة البطارية والمحرك', en: 'Battery and motor simulation' },
    { ar: 'تسجيل SQLite', en: 'SQLite logging' },
    { ar: 'واجهة HUD للسيارات', en: 'Automotive HUD interface' }
  ],
  note: {
    ar: 'أرقام السرعة والشحن الظاهرة على بطاقة الموقع قيم توضيحية محلية فقط؛ الموقع الشخصي لا يتصل بخادم اللوحة.',
    en: 'Speed and SOC values shown on this profile card are local presentation values; this personal site does not connect to the dashboard server.'
  }
};
