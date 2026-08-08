'use strict';

(function () {
  // خريطة: id البطاقة => مسار الـSVG
  const BRAND_ICONS = {
    'rockstar-games': 'assets/img/brands/rockstar-games.svg',
    'ubisoft':        'assets/img/brands/ubisoft.svg',
    'ea':             'assets/img/brands/ea.svg'
  };

  function injectIcon(cardEl, iconPath) {
    // إذا الصورة محقونة أصلاً، ما نكررها
    if (cardEl.querySelector('.brand-icon-injected')) return;

    // بندور على أي عنصر أيقونة موجود جوا الكارد (i.fa-*, .card-icon, span فاضي..)
    const iconHost =
      cardEl.querySelector('[class*="icon"]') || cardEl;

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'brand-icon-injected';

    img.addEventListener('error', () => {
      console.warn('[brand-icons] فشل تحميل:', iconPath);
    });

    // منشيل أي <i> فونت أوسوم كانت مكانها
    const oldIcon = iconHost.querySelector('i');
    if (oldIcon) oldIcon.replaceWith(img);
    else iconHost.appendChild(img);
  }

  function applyAll() {
    Object.keys(BRAND_ICONS).forEach((id) => {
      const card =
        document.getElementById(id) ||
        document.querySelector(`[data-id="${id}"]`);

      if (card) injectIcon(card, BRAND_ICONS[id]);
    });
  }

  // البطاقات ممكن تترسم بعد تحميل الصفحة (fetch/async)
  // فبنراقب الـ DOM لحد ما تظهر، وبنوقف المراقبة بعدها
  const observer = new MutationObserver(() => {
    applyAll();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', applyAll);

  // نداء إضافي احتياطي بعد ثانية، تحسبًا لأي تأخير بالرسم
  setTimeout(applyAll, 1000);
})();