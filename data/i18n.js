export const I18N = {
  en: {
    meta: {
      title: 'Omar AbuZeineh — EV & Hybrid Engineering, Web, Technical Building',
      description:
        'Omar AbuZeineh is an electric and hybrid vehicle engineering student who builds practical web and automotive systems. Flagship project: TAAMEN.'
    },
    skip: 'Skip to content',
    nav: {
      home: 'Home',
      work: 'Projects',
      about: 'About',
      engineering: 'Engineering',
      contact: 'Contact',
      open: 'Open menu',
      close: 'Close menu',
      menu: 'Menu'
    },
    chrome: {
      lang: 'العربية',
      langAria: 'Switch language to Arabic',
      themeToLight: 'Switch to light theme',
      themeToDark: 'Switch to dark theme'
    },
    hero: {
      kicker: 'Personal lab',
      name: 'Omar AbuZeineh',
      roleEv: 'EV & Hybrid Engineering',
      roleWeb: 'Web Development',
      roleBuild: 'Technical Building',
      statement:
        'Building practical technical projects where automotive engineering, software, and experimentation meet.',
      ctaWork: 'View projects',
      ctaEng: 'Explore engineering',
      ctaContact: 'Contact',
      schemaLabel: 'System map',
      nodeBattery: 'Battery',
      nodeMotor: 'Motor',
      nodeCan: 'CAN',
      nodeBms: 'BMS',
      nodeWeb: 'Web'
    },
    work: {
      kicker: '02 — Selected work',
      title: 'Things that actually run',
      lead: 'Shipped systems first. Experiments labeled as experiments. Planned work stays in Current Focus, not in this list.'
    },
    filter: {
      all: 'All',
      web: 'Web',
      engineering: 'Engineering',
      automotive: 'Automotive'
    },
    status: {
      evolving: 'Evolving',
      experimental: 'Experimental',
      planned: 'Planned'
    },
    project: {
      live: 'Live',
      repo: 'Repository',
      details: 'Inspect',
      close: 'Close project',
      tech: 'Stack',
      highlights: 'What is in it',
      architecture: 'Architecture',
      notes: 'Notes',
      year: 'Year',
      category: 'Category',
      status: 'Status',
      taamen: {
        title: 'TAAMEN',
        subtitle: 'Football management & tactical platform',
        short:
          'A local-first football workspace for matches, archive, and tactical play — the flagship system on this site.',
        long:
          'TAAMEN 2.0 is one local-first football workspace with two experiences that share the same shell: a normal on-device flow, and a read-only featured-member historical archive. It is an evolving product, not a frozen demo.',
        architecture:
          'React, TypeScript, and Vite on the client. IndexedDB for the local-first archive. Production is a Cloudflare Worker that serves the app and API on taamenn.com. A GitHub Pages build also exists at omar-i9.github.io/taamenn.',
        notes:
          'Tactical Radar and the AI assistant are not current user-facing features. Do not treat GitHub Pages as the only live URL — production is taamenn.com.',
        h1: 'Local match create, archive, and match center',
        h2: 'Tactical playground for the normal local experience',
        h3: 'Profile, settings, and support in a shared shell',
        h4: 'Featured-member historical archive (read-only)',
        h5: 'PWA infrastructure retained'
      },
      ev: {
        title: 'EV Telemetry Dashboard',
        subtitle: 'Physics-based EV simulation HUD',
        short:
          'A full-stack simulation dashboard: battery and motor models, WebSocket streaming, and a dark automotive HUD.',
        long:
          'This is a learning and prototype system, not a vehicle in production. A Python/Flask backend runs physics-based battery, motor, thermal, and road-load models and streams a snapshot over WebSocket. The frontend is a HUD-style layout with gauges and charts.',
        architecture:
          'Python 3, Flask, Flask-SocketIO, SQLite logging, vanilla HTML/CSS/JS frontend. Hosted demo on Render may cold-start.',
        notes:
          'README on the personal site still listed this under “building next”; the public repository and demo already exist. Status here is experimental / implemented.',
        h1: 'SOC, pack voltage, thermal, and motor models from documented equations',
        h2: 'Live telemetry over WebSocket with HTTP snapshot fallback',
        h3: 'Alert thresholds and trip logging in SQLite',
        h4: 'Automotive HUD interface for the simulation stream'
      }
    },
    about: {
      kicker: '03 — About',
      title: 'Who is building this',
      whoTitle: 'Who I am',
      whoBody:
        'Omar AbuZeineh. Electric and hybrid vehicle engineering student, web developer, and technical builder. Palestinian. Tawjihi class of 2009 — that is a personal fact, not the headline.',
      buildTitle: 'What I build',
      buildBody:
        'Usable prototypes and documented systems: a football operations platform (TAAMEN), EV simulation and telemetry experiments, and interfaces that have to survive real devices.',
      learnTitle: 'What I am learning',
      learnBody:
        'EV and hybrid systems, diagnostics, telemetry, battery packs, motors, CAN Bus, BMS concepts, frontend architecture, browser APIs, Git, and GitHub.',
      exploreTitle: 'What I am exploring',
      exploreBody:
        'TypeScript and React in production on TAAMEN. Python and embedded C on the public GitHub profile. Next: CAN tooling, BMS simulation, and more automotive prototypes.',
      quote: 'I prefer projects that are usable, maintainable, and explainable — not just visually impressive.'
    },
    engineering: {
      kicker: '04 — Engineering',
      title: 'EV / hybrid direction',
      lead:
        'These are learning, building, and experimenting tracks — not professional certifications or commercial products.',
      battery: {
        title: 'Battery systems',
        body: 'Pack behaviour, SOC/SOH ideas, voltage under load, and why a dashboard number has to come from a model.'
      },
      bms: {
        title: 'BMS concepts',
        body: 'Cell monitoring, balancing, protection logic — currently a planned simulator, not a shipped product.'
      },
      can: {
        title: 'CAN Bus',
        body: 'Frames, signals, and diagnostics as a practical learning path toward tooling, not a vendor stack.'
      },
      diag: {
        title: 'Diagnostics',
        body: 'Fault thinking: thresholds, logs, and making vehicle-shaped problems visible in software.'
      },
      tele: {
        title: 'Telemetry',
        body: 'Streaming measurements into an interface people can actually read — see the EV dashboard experiment.'
      },
      motor: {
        title: 'Electric motors',
        body: 'RPM, torque, efficiency, and thermal rise as connected parts of a drivetrain model.'
      }
    },
    focus: {
      kicker: '05 — Current focus',
      title: 'Now, next, later',
      lead: 'A working notebook, not a corporate roadmap.',
      now: 'Now',
      next: 'Next',
      long: 'Long term',
      taamen: {
        title: 'TAAMEN architecture and UX',
        body: 'Keep the flagship football platform clearer, more maintainable, and honest about what is live.'
      },
      docs: {
        title: 'Profile and project documentation',
        body: 'This site, repository hygiene, and writing systems so they can be explained.'
      },
      ev: {
        title: 'EV telemetry dashboard',
        body: 'Continue the physics-based dashboard as an experimental engineering surface.'
      },
      can: {
        title: 'CAN Bus tooling',
        body: 'Planned: decode and visualize frames, signals, and diagnostic data. Not shipped yet.'
      },
      bms: {
        title: 'BMS simulation',
        body: 'Planned: cell monitoring, balancing, states, and protection logic. Not shipped yet.'
      },
      embedded: {
        title: 'Embedded / automotive prototypes',
        body: 'More hardware-adjacent experiments as skills catch up to the vehicle side.'
      },
      long: {
        title: 'Diagnostics + visualization',
        body: 'Combine automotive engineering and software into practical diagnostic and visualization tools.'
      }
    },
    stack: {
      kicker: '06 — Stack',
      title: 'Tools in actual use',
      lead: 'Grouped by where they show up. No skill bars. TypeScript and React are listed because TAAMEN 2.0 uses them.',
      web: 'Web',
      engineering: 'Engineering',
      tools: 'Tools'
    },
    mindset: {
      kicker: '07 — Method',
      title: 'How a system gets built',
      lead: 'The same loop, written so it can be inspected.',
      s1: 'Understand the system',
      s2: 'Design the architecture',
      s3: 'Build a working prototype',
      s4: 'Test real behavior',
      s5: 'Fix edge cases',
      s6: 'Document the result'
    },
    contact: {
      kicker: '08 — Contact',
      title: "Let's build something",
      lead: 'GitHub is the reliable public channel. Instagram is public. Discord is a username you can copy — there is no public email on this site.',
      github: 'GitHub',
      instagram: 'Instagram',
      discord: 'Discord',
      copy: 'Copy',
      copied: 'Copied',
      elsewhere: 'Elsewhere',
      ids: 'Gaming IDs',
      share: 'Share this page',
      shared: 'Share opened',
      shareFail: 'Link copied instead'
    },
    ids: {
      steam: 'Steam friend code',
      epic: 'Epic Games',
      ubisoft: 'Ubisoft Connect',
      ea: 'EA account'
    },
    footer: {
      roles: 'EV & Hybrid Engineering Student · Web Developer · Technical Builder',
      ayahNote: 'Meaning rendering, not a scholarly translation. Sources: Tanzil / project notes.',
      ayah: 'Do not despair of Allah’s mercy.',
      ayahRef: 'Az-Zumar 53',
      rights: '© 2026 Omar AbuZeineh'
    },
    modal: {
      live: 'Open live site',
      repo: 'Open repository'
    },
    error: {
      title: 'This page is not here',
      body: 'The lab path you asked for does not exist.',
      home: 'Back to home'
    }
  },
  ar: {
    meta: {
      title: 'عُمَر — هندسة المركبات الكهربائية والهايبرد، تطوير ويب، وبناء تقني',
      description:
        'عُمَر (Omar AbuZeineh) طالب هندسة مركبات كهربائية وهايبرد يبني أنظمة عملية بين البرمجيات والسيارات. المشروع الأبرز: تأمين.'
    },
    skip: 'تخطَّ إلى المحتوى',
    nav: {
      home: 'الرئيسية',
      work: 'المشاريع',
      about: 'نبذة',
      engineering: 'الهندسة',
      contact: 'تواصل',
      open: 'فتح القائمة',
      close: 'إغلاق القائمة',
      menu: 'القائمة'
    },
    chrome: {
      lang: 'English',
      langAria: 'تغيير اللغة إلى الإنجليزية',
      themeToLight: 'التبديل إلى المظهر الفاتح',
      themeToDark: 'التبديل إلى المظهر الداكن'
    },
    hero: {
      kicker: 'مختبر شخصي',
      name: 'عُمَر',
      roleEv: 'هندسة المركبات الكهربائية والهايبرد',
      roleWeb: 'تطوير الويب',
      roleBuild: 'بناء تقني',
      statement:
        'أبني مشاريع تقنية عملية عند تقاطع هندسة السيارات والبرمجيات والتجريب.',
      ctaWork: 'عرض المشاريع',
      ctaEng: 'استكشاف الهندسة',
      ctaContact: 'تواصل',
      schemaLabel: 'خريطة نظام',
      nodeBattery: 'بطارية',
      nodeMotor: 'محرك',
      nodeCan: 'CAN',
      nodeBms: 'BMS',
      nodeWeb: 'ويب'
    },
    work: {
      kicker: '02 — أعمال مختارة',
      title: 'أشياء تعمل فعلًا',
      lead: 'الأنظمة المنشورة أولًا. التجارب تُوسم كتجارب. العمل المخطط يبقى في التركيز الحالي، لا في هذه القائمة.'
    },
    filter: {
      all: 'الكل',
      web: 'ويب',
      engineering: 'هندسة',
      automotive: 'سيارات'
    },
    status: {
      evolving: 'يتطور',
      experimental: 'تجريبي',
      planned: 'مخطط'
    },
    project: {
      live: 'النسخة الحية',
      repo: 'المستودع',
      details: 'تفاصيل',
      close: 'إغلاق المشروع',
      tech: 'التقنيات',
      highlights: 'ماذا فيه',
      architecture: 'المعمارية',
      notes: 'ملاحظات',
      year: 'السنة',
      category: 'التصنيف',
      status: 'الحالة',
      taamen: {
        title: 'تأمين',
        subtitle: 'منصة إدارة كرة قدم وتخطيط تكتيكي',
        short:
          'مساحة عمل كروية محلية للمباريات والأرشيف والملعب التكتيكي — المشروع الأبرز في هذا الموقع.',
        long:
          'تأمين 2.0 مساحة عمل كروية محلية أولًا، بتجربتين على نفس الهيكل: مسار محلي للمستخدم العادي، وأرشيف تاريخي للقراءة فقط للعضو المميز. منتج يتطور، وليس عرضًا مجمّدًا.',
        architecture:
          'React وTypeScript وVite في الواجهة. IndexedDB للأرشيف المحلي. الإنتاج على Cloudflare Worker في taamenn.com. توجد أيضًا نسخة GitHub Pages.',
        notes:
          'الرادار التكتيكي والمساعد الذكي ليسا ميزتين ظاهرتين حاليًا. عنوان GitHub Pages ليس العنوان الحي الوحيد — الإنتاج على taamenn.com.',
        h1: 'إنشاء مباريات محلية وأرشيف ومركز مباراة',
        h2: 'ملعب تكتيكي لتجربة المستخدم المحلي',
        h3: 'ملف شخصي وإعدادات ودعم ضمن هيكل واحد',
        h4: 'أرشيف تاريخي للعضو المميز (قراءة فقط)',
        h5: 'بنية PWA محفوظة'
      },
      ev: {
        title: 'لوحة تلِمتري للمركبة الكهربائية',
        subtitle: 'محاكاة فيزيائية بواجهة HUD',
        short:
          'لوحة تحكم محاكاة كاملة: نماذج بطارية ومحرك، وبث WebSocket، وواجهة سيارات داكنة.',
        long:
          'نظام تعلّم ونموذج أولي، وليس مركبة إنتاج. الخلفية Python/Flask تشغّل نماذج فيزيائية للبطارية والمحرك والحرارة وحمل الطريق وتبث لقطة عبر WebSocket. الواجهة بهيئة HUD مع مقاييس ومخططات.',
        architecture:
          'Python 3 وFlask وFlask-SocketIO وتسجيل SQLite وواجهة HTML/CSS/JS. النسخة على Render قد تحتاج إقلاعًا باردًا.',
        notes:
          'README الشخصي ما زال يدرج المشروع تحت «التالي»؛ المستودع العام والنسخة التجريبية موجودان. الحالة هنا: تجريبي / منفَّذ.',
        h1: 'نماذج SOC وجهد الحزمة والحرارة والمحرك من معادلات موثّقة',
        h2: 'تلِمتري حي عبر WebSocket مع بديل HTTP',
        h3: 'عتبات تنبيه وسجل رحلات في SQLite',
        h4: 'واجهة HUD لمسار المحاكاة'
      }
    },
    about: {
      kicker: '03 — نبذة',
      title: 'من يبني هذا',
      whoTitle: 'من أنا',
      whoBody:
        'عُمَر (Omar AbuZeineh). طالب هندسة مركبات كهربائية وهايبرد، مطوّر ويب، وبنّاء تقني. فلسطيني. توجيهي 2009 — معلومة شخصية، ليست العنوان.',
      buildTitle: 'ماذا أبني',
      buildBody:
        'نماذج أولية قابلة للاستخدام وأنظمة موثّقة: منصة تشغيل كروي (تأمين)، وتجارب محاكاة وتلِمتري للمركبات الكهربائية، وواجهات عليها أن تصمد على أجهزة حقيقية.',
      learnTitle: 'ماذا أتعلم',
      learnBody:
        'أنظمة كهربائية وهايبرد، تشخيص، تلِمتري، حزم بطاريات، محركات، CAN Bus، مفاهيم BMS، معمارية الواجهات، واجهات المتصفح، Git وGitHub.',
      exploreTitle: 'ماذا أستكشف',
      exploreBody:
        'TypeScript وReact في تأمين. Python وEmbedded C على الملف العام في GitHub. التالي: أدوات CAN، محاكاة BMS، ومزيد من النماذج الأولية للسيارات.',
      quote: 'أفضل المشاريع القابلة للاستخدام والصيانة والشرح — لا المبهرة بصريًا فقط.'
    },
    engineering: {
      kicker: '04 — هندسة',
      title: 'اتجاه الكهرباء / الهايبرد',
      lead: 'مسارات تعلّم وبناء وتجريب — ليست شهادات مهنية ولا منتجات تجارية.',
      battery: {
        title: 'أنظمة البطارية',
        body: 'سلوك الحزمة، أفكار SOC/SOH، الجهد تحت الحمل، ولماذا يجب أن يأتي رقم اللوحة من نموذج.'
      },
      bms: {
        title: 'مفاهيم BMS',
        body: 'مراقبة الخلايا، الموازنة، منطق الحماية — محاكٍ مخطط، ليس منتجًا منشورًا.'
      },
      can: {
        title: 'CAN Bus',
        body: 'إطارات وإشارات وتشخيص كمسار تعلّم عملي نحو أدوات، لا كحزمة مورّد.'
      },
      diag: {
        title: 'التشخيص',
        body: 'تفكير الأعطال: عتبات وسجلات وجعل مشكلات بشكل مركبة مرئية في البرمجيات.'
      },
      tele: {
        title: 'التلِمتري',
        body: 'بث القياسات إلى واجهة يمكن قراءتها — انظر تجربة لوحة المركبة الكهربائية.'
      },
      motor: {
        title: 'المحركات الكهربائية',
        body: 'السرعة والعزم والكفاءة والارتفاع الحراري كأجزاء متصلة في نموذج مجموعة الدفع.'
      }
    },
    focus: {
      kicker: '05 — التركيز الحالي',
      title: 'الآن، التالي، لاحقًا',
      lead: 'دفتر عمل، لا خارطة طريق مؤسسية.',
      now: 'الآن',
      next: 'التالي',
      long: 'طويل الأمد',
      taamen: {
        title: 'معمارية وتجربة تأمين',
        body: 'الإبقاء على المنصة الكروية أوضح وأسهل صيانة، مع صدق حول ما هو حي.'
      },
      docs: {
        title: 'توثيق الملف والمشاريع',
        body: 'هذا الموقع، وترتيب المستودعات، وكتابة الأنظمة بحيث يمكن شرحها.'
      },
      ev: {
        title: 'لوحة تلِمتري للمركبة الكهربائية',
        body: 'متابعة لوحة المحاكاة الفيزيائية كسطح هندسي تجريبي.'
      },
      can: {
        title: 'أدوات CAN Bus',
        body: 'مخطط: فكّ الإطارات والإشارات وبيانات التشخيص وعرضها. غير منشور بعد.'
      },
      bms: {
        title: 'محاكاة BMS',
        body: 'مخطط: مراقبة الخلايا والموازنة والحالات ومنطق الحماية. غير منشور بعد.'
      },
      embedded: {
        title: 'نماذج أولية مدمجة / سيارات',
        body: 'مزيد من التجارب القريبة من العتاد مع تقدّم الجانب المركباتي.'
      },
      long: {
        title: 'تشخيص + تصور',
        body: 'جمع هندسة السيارات والبرمجيات في أدوات تشخيص وتصوّر عملية.'
      }
    },
    stack: {
      kicker: '06 — التقنيات',
      title: 'أدوات مستخدمة فعلًا',
      lead: 'مجمّعة حسب موضعها. بلا أشرطة نسب. TypeScript وReact مذكوران لأن تأمين 2.0 يستخدمهما.',
      web: 'ويب',
      engineering: 'هندسة',
      tools: 'أدوات'
    },
    mindset: {
      kicker: '07 — المنهج',
      title: 'كيف يُبنى النظام',
      lead: 'الحلقة نفسها، مكتوبة حتى يمكن فحصها.',
      s1: 'افهم النظام',
      s2: 'صمّم المعمارية',
      s3: 'ابنِ نموذجًا أوليًا يعمل',
      s4: 'اختبر السلوك الحقيقي',
      s5: 'أصلح الحالات الحدّية',
      s6: 'وثّق النتيجة'
    },
    contact: {
      kicker: '08 — تواصل',
      title: 'لنبنِ شيئًا',
      lead: 'GitHub هو القناة العامة الموثوقة. إنستغرام عام. ديسكورد اسم مستخدم للنسخ — لا يوجد بريد عام في هذا الموقع.',
      github: 'GitHub',
      instagram: 'إنستغرام',
      discord: 'ديسكورد',
      copy: 'نسخ',
      copied: 'تم النسخ',
      elsewhere: 'أماكن أخرى',
      ids: 'معرّفات الألعاب',
      share: 'شارك هذه الصفحة',
      shared: 'فُتحت المشاركة',
      shareFail: 'تم نسخ الرابط بدلًا من ذلك'
    },
    ids: {
      steam: 'رمز صديق Steam',
      epic: 'Epic Games',
      ubisoft: 'Ubisoft Connect',
      ea: 'حساب EA'
    },
    footer: {
      roles: 'طالب هندسة مركبات كهربائية وهايبرد · مطوّر ويب · بنّاء تقني',
      ayahNote: 'معنى تقريبي، ليس ترجمة علمية. المصادر: Tanzil / ملاحظات المشروع.',
      ayah: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
      ayahRef: 'الزمر 53',
      rights: '© 2026 عُمَر · Omar AbuZeineh'
    },
    modal: {
      live: 'فتح النسخة الحية',
      repo: 'فتح المستودع'
    },
    error: {
      title: 'هذه الصفحة ليست هنا',
      body: 'المسار الذي طلبته غير موجود في المختبر.',
      home: 'العودة للرئيسية'
    }
  }
};
