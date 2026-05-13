(() => {
  const translations = {
    ar: {
      heroName: 'عُـمَر | Omar',
      heroDesc: 'دامك دخلت كمل معروفك وشوف الباقي..!',
      langHint: 'تغيير اللغة',
      socialLinksTitle: 'روابط التواصل',
      instagramAr: 'انستجرام',
      snapchatAr: 'سناب شات',
      tiktokAr: 'تيك توك',
      facebookAr: 'فيسبوك',
      discordAr: 'ديسكورد',
      discordNote: 'اضغط لفتح البطاقة داخل الموقع',
      quickCopyTitle: 'نسخ سريع',
      steamFriendLabel: 'Steam Friend Code',
      epicGamesLabel: 'Epic Games',
      copyBtn: 'نسخ',
      projectTitle: 'مشروع؟',
      projectName: 'تأمين',
      projectDesc: 'بين نبضِ العطاءِ ووقارِ الختام.. يُجمد التطوير ليبقى المشروعُ إرثاً تقنياً، ورمزاً لرحلةٍ اكتملت فخلدت.',
      footerBrand: 'عُـمَر | Omar',
      footerText1: 'جميع الحقوق غير محفوظة © 2026',
      footerText2: 'بتعرف انه كل هاد شغل ايدي؟',
      shareTitle: 'بوابة المشاركة',
      shareText: 'امسح الكود أو شارك الرابط مباشرة',
      shareCopy: 'نسخ',
      nowPlaying: 'Now Playing',
      playlistTitle: 'قائمة الأغاني',
      audioState: 'اضغط على أي أغنية للتشغيل',
      pageTitle: 'Omar Profiles',
      ariaBtn: 'تبديل اللغة إلى الإنجليزية'
    },
    en: {
      heroName: 'Omar | عُـمَر',
      heroDesc: 'Since you came in, keep going and check the rest..!',
      langHint: 'Change language',
      socialLinksTitle: 'Social Links',
      instagramAr: 'Instagram',
      snapchatAr: 'Snapchat',
      tiktokAr: 'TikTok',
      facebookAr: 'Facebook',
      discordAr: 'Discord',
      discordNote: 'Press to open the card inside the site',
      quickCopyTitle: 'Quick Copy',
      steamFriendLabel: 'Steam Friend Code',
      epicGamesLabel: 'Epic Games',
      copyBtn: 'Copy',
      projectTitle: 'Project?',
      projectName: 'Taamenn',
      projectDesc: 'Between the pulse of giving and the dignity of closure, development is frozen so the project remains a technical legacy and the symbol of a journey completed and remembered.',
      footerBrand: 'Omar | عُـمَر',
      footerText1: 'All rights unreserved © 2026',
      footerText2: 'Did you know all this was made by hand?',
      shareTitle: 'Share Portal',
      shareText: 'Scan the code or share the link directly',
      shareCopy: 'Copy',
      nowPlaying: 'Now Playing',
      playlistTitle: 'Playlist',
      audioState: 'Click any song to play',
      pageTitle: 'Omar Profiles',
      ariaBtn: 'Switch language to Arabic'
    }
  };

  const html = document.documentElement;
  const langBtn = document.getElementById('langToggleBtn');
  const titleEl = document.getElementById('tabTitle');

  function applyLanguage(lang) {
    const t = translations[lang] || translations.ar;

    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('siteLang', lang);

    if (titleEl) titleEl.textContent = t.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t, key)) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (Object.prototype.hasOwnProperty.call(t, key)) {
        el.innerHTML = t[key];
      }
    });

    if (langBtn) {
      langBtn.setAttribute('aria-label', t.ariaBtn);
      langBtn.setAttribute('title', t.ariaBtn);
    }
  }

  function toggleLanguage() {
    const current = html.lang === 'ar' ? 'ar' : 'en';
    applyLanguage(current === 'ar' ? 'en' : 'ar');
  }

  const savedLang = localStorage.getItem('siteLang');
  applyLanguage(savedLang === 'en' ? 'en' : 'ar');

  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }
})();