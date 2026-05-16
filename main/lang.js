/**
 * lang.js — Omar Profiles
 * تبديل اللغة عربي / إنجليزي مع حفظ التفضيل
 */
(() => {

  /* ═══════════════════════════════════════════
     ترجمات النصوص
  ════════════════════════════════════════════ */
  const translations = {
    ar: {
      heroName:         'عُـمَر | Omar',
      heroDesc:         'دامك دخلت كمل معروفك وشوف الباقي..!',
      langHint:         'تغيير اللغة',
      socialLinksTitle: 'روابط التواصل',
      instagramAr:      'انستجرام',
      snapchatAr:       'سناب شات',
      tiktokAr:         'تيك توك',
      facebookAr:       'فيسبوك',
      threadsAr:        'ثريدز',
      githubAr:         'جيت هاب',
      chessAr:          'شطرنج',
      steamAr:          'ستيم',
      twitchAr:         'تويتش',
      xAr:              'اكس',
      spotifyAr:        'اسبوتيفاي',
      tellonymAr:       'تيلونيوم',
      discordAr:        'ديسكورد',
      discordNote:      'اضغط لفتح البطاقة داخل الموقع',
      quickCopyTitle:   'نسخ سريع',
      steamFriendLabel: 'Steam Friend Code',
      epicGamesLabel:   'Epic Games',
      copyBtn:          'نسخ',
      projectTitle:     'مشروع؟',
      projectName:      'تأمين',
      projectDesc:      'بين نبضِ العطاءِ ووقارِ الختام.. يُجمد التطوير ليبقى المشروعُ إرثاً تقنياً، ورمزاً لرحلةٍ اكتملت فخلدت.',
      footerBrand:      'عُـمَر | Omar',
      footerText1:      'جميع الحقوق غير محفوظة © 2026',
      footerText2:      'بتعرف انه كل هاد شغل ايدي؟',
      shareTitle:       'بوابة المشاركة',
      shareText:        'امسح الكود أو شارك الرابط مباشرة',
      shareCopy:        'نسخ',
      nowPlaying:       'Now Playing',
      playlistTitle:    'قائمة الأغاني',
      audioState:       'اضغط على أي أغنية للتشغيل',
      pageTitle:        'Omar Profiles',
      ariaBtn:          'تبديل اللغة إلى الإنجليزية',
      footerLine1:      'الفولو ما بكهربك',
      footerLine2:      'كل حساباتي هون ليش بعرفش',
    },
    en: {
      heroName:         'Omar | عُـمَر',
      heroDesc:         'Since you came in, keep going and check the rest..!',
      langHint:         'Change language',
      socialLinksTitle: 'Social Links',
      instagramAr:      'Instagram',
      snapchatAr:       'Snapchat',
      tiktokAr:         'TikTok',
      facebookAr:       'Facebook',
        threadsAr:        'Threads',
      githubAr:         'GitHub',
      chessAr:          'Chess.com',
      steamAr:          'Steam',
      twitchAr:         'Twitch',
      xAr:              'X',
      spotifyAr:        'Spotify',
      tellonymAr:       'Tellonym',
      discordAr:        'Discord',
      discordNote:      'Press to open the card inside the site',
      quickCopyTitle:   'Quick Copy',
      steamFriendLabel: 'Steam Friend Code',
      epicGamesLabel:   'Epic Games',
      copyBtn:          'Copy',
      projectTitle:     'Project?',
      projectName:      'Taamenn',
      projectDesc:      'Between the pulse of giving and the dignity of closure, development is frozen so the project remains a technical legacy — a symbol of a journey completed and remembered.',
      footerBrand:      'Omar | عُـمَر',
      footerText1:      'All rights unreserved © 2026',
      footerText2:      'Did you know all this was made by hand?',
      shareTitle:       'Share Portal',
      shareText:        'Scan the code or share the link directly',
      shareCopy:        'Copy',
      nowPlaying:       'Now Playing',
      playlistTitle:    'Playlist',
      audioState:       'Click any song to play',
      pageTitle:        'Omar Profiles',
      ariaBtn:          'Switch language to Arabic',
      footerLine1:      'Following won\'t electrocute you',
      footerLine2:      'All my accounts are right here — why not?',
    }
  };

  /* ═══════════════════════════════════════════
     عناصر ثابتة
  ════════════════════════════════════════════ */
  const html    = document.documentElement;
  const langBtn = document.getElementById('langToggleBtn');
  const titleEl = document.getElementById('tabTitle');

  /* ═══════════════════════════════════════════
     تطبيق اللغة
  ════════════════════════════════════════════ */
  function applyLanguage(lang) {
    const t = translations[lang] || translations.ar;
    const isRTL = lang === 'ar';

    /* اتجاه الصفحة */
    html.lang = lang;
    html.dir  = isRTL ? 'rtl' : 'ltr';

    /* حفظ التفضيل */
    try { localStorage.setItem('siteLang', lang); } catch (_) { /* private mode */ }

    /* عنوان التاب */
    if (titleEl) titleEl.textContent = t.pageTitle;

    /* نصوص data-i18n */
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t, key)) {
        el.textContent = t[key];
      }
    });

    /* نصوص HTML data-i18n-html */
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (Object.prototype.hasOwnProperty.call(t, key)) {
        el.innerHTML = t[key];
      }
    });

    /* زر اللغة */
    if (langBtn) {
      langBtn.setAttribute('aria-label', t.ariaBtn);
      langBtn.setAttribute('title',      t.ariaBtn);
    }

    /* ─── تحديث font للإنجليزية ─── */
    document.body.style.fontFamily = isRTL
      ? "'Cairo', sans-serif"
      : "'Cairo', 'Inter', system-ui, sans-serif";

    /* ─── مؤشر بصري على الزر ─── */
    if (langBtn) {
      langBtn.dataset.lang = lang;
    }
  }

  /* ═══════════════════════════════════════════
     تبديل اللغة
  ════════════════════════════════════════════ */
  function toggleLanguage() {
    const next = html.lang === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
  }

  /* ═══════════════════════════════════════════
     التهيئة الأولية
  ════════════════════════════════════════════ */
  let savedLang = 'ar';
  try { savedLang = localStorage.getItem('siteLang') || 'ar'; } catch (_) {}

  applyLanguage(savedLang === 'en' ? 'en' : 'ar');

  /* ─── ربط زر اللغة ─── */
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }

  /* ─── اختصار لوحة المفاتيح: Alt + L ─── */
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      toggleLanguage();
    }
  });

})();