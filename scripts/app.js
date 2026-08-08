'use strict';

(function () {
  const site = window.OMAR_SITE || {};
  const i18n = window.OMAR_I18N;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const state = {
    activeFilter: 'all',
    ayahIndex: 0,
    ayahOrder: [],
    ayahPointer: 0,
    ayahTimer: 0,
    titleIndex: 0,
    charIndex: 0,
    deleting: false,
    titleTimer: 0,
    titlePaused: false,
    cancelNextCardClick: false,
    drag: null,
    profileTimer: 0,
    currentStatus: null,
    ayahDelay: 0,
    ayahDragRaf: 0,
    ayahDragLast: null,
    ayahClickBlockedUntil: 0,
    lowPower: false
  };

  const readyStartedAt = performance.now();

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

function icon(className) {
  if (/\.(svg|png|webp)$/i.test(className)) {
    return `<img src="${escapeHtml(className)}" alt="" class="brand-icon-img" loading="lazy" decoding="async">`;
  }
  return `<i class="${escapeHtml(className)}" aria-hidden="true"></i>`;
}
  const socialOrder = ['instagram', 'snapchat', 'github', 'tiktok', 'discord', 'tiktok-gdmi33'];
  const badgeKeys = {
    featured: 'badgeFeatured',
    public: 'badgePublic',
    private: 'badgePrivate',
    official: 'badgeOfficial',
    contact: 'badgeContact'
  };

  function orderedSocialLinks() {
    return (site.socialLinks || []).slice().sort((a, b) => {
      const ai = socialOrder.indexOf(a.id);
      const bi = socialOrder.indexOf(b.id);
      const ap = ai === -1 ? 100 + (site.socialLinks || []).indexOf(a) : ai;
      const bp = bi === -1 ? 100 + (site.socialLinks || []).indexOf(b) : bi;
      return ap - bp;
    });
  }

  function renderBadges(item) {
    const badges = item.badges?.length ? item.badges : [item.badge === 'PUBLIC' ? 'public' : 'private'];
    return `<span class="social-badges">${badges.map((badge) => {
      const key = badgeKeys[badge] || (badge === 'public' ? 'privacyPublic' : 'privacyPrivate');
      const label = escapeHtml(i18n?.t(key, badge) || badge);
      return `<span class="social-badge social-badge-${escapeHtml(badge)}" data-i18n="${escapeHtml(key)}">${label}</span>`;
    }).join('')}</span>`;
  }

  function renderHeroActions() {
    const wrap = $('#heroActions');
    if (!wrap) return;
    wrap.innerHTML = (site.heroActions || []).map((item) => {
      const label = escapeHtml(i18n?.t(item.labelKey, item.label) || item.label);
      if (item.url) {
        return `<a class="hero-action interactive magnetic hero-action-${escapeHtml(item.id)}" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" data-action-id="${escapeHtml(item.id)}" data-burst>${icon(item.icon)}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></a>`;
      }
      return `<button class="hero-action interactive magnetic hero-action-${escapeHtml(item.id)}" type="button" data-action="${escapeHtml(item.action)}" data-action-id="${escapeHtml(item.id)}" aria-label="${label}" data-burst>${icon(item.icon)}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></button>`;
    }).join('');
  }

  function renderFilters() {
    // Removed category filters to keep the original source-style full grid.
  }

  function renderSocialLinks() {
    const grid = $('#linksGrid');
    if (!grid) return;
    grid.innerHTML = orderedSocialLinks().map((item, index) => {
      const title = escapeHtml(i18n?.t(item.titleKey, item.title) || item.title);
      const handle = escapeHtml(item.handleKey ? i18n?.t(item.handleKey, item.handle) : item.handle);
      const longCopyAttr = item.longCopy ? ' data-longcopy' : '';
      const content = `
        ${renderBadges(item)}
        <span class="social-icon">${icon(item.icon)}${item.extraBadge ? `<span class="brilliant-badge">${escapeHtml(item.extraBadge)}</span>` : ''}</span>
        <div class="social-text"><strong data-i18n="${escapeHtml(item.titleKey)}">${title}</strong><span${item.handleKey ? ` data-i18n="${escapeHtml(item.handleKey)}"` : ''}>${handle}</span></div>
      `;
      const baseClass = `social-card ${escapeHtml(item.className)} reveal`;
      const delay = `style="--delay:${Math.min(index * 55, 520)}ms"`;

      if (item.action) {
        return `<button class="${baseClass}" ${delay} type="button" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-action="${escapeHtml(item.action)}" data-copy-text="${escapeHtml(item.copy || item.url || '')}" aria-label="${title}"${longCopyAttr} data-burst>${content}</button>`;
      }
      return `<a class="${baseClass}" ${delay} href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-copy-text="${escapeHtml(item.url)}" aria-label="${title}"${longCopyAttr} data-burst>${content}</a>`;
    }).join('');
  }

function renderCopyRows() {
  const wrap = $('#copyList');
  if (!wrap) return;
  wrap.innerHTML = (site.quickCopy || []).map((item, index) => {
    const label = escapeHtml(i18n?.t(item.labelKey, item.label) || item.label);
    const copyLabel = escapeHtml(i18n?.t('copyBtn', 'نسخ') || 'نسخ');
    return `
      <div class="copy-row reveal" style="--delay:${index * 70}ms">
        ${item.icon ? `<span class="copy-icon">${icon(item.icon)}</span>` : ''}
        <div class="copy-meta"><span data-i18n="${escapeHtml(item.labelKey)}">${label}</span><strong>${escapeHtml(item.value)}</strong></div>
        <button class="copy-btn interactive" type="button" data-copy="${escapeHtml(item.value)}" data-burst data-i18n="copyBtn">${copyLabel}</button>
      </div>
    `;
  }).join('');
}

  function renderProjects() {
    const wrap = $('#projectsList');
    if (!wrap) return;
    wrap.innerHTML = (site.projects || []).map((project, index) => {
      const title = escapeHtml(i18n?.t(project.titleKey, project.title) || project.title);
      const desc = escapeHtml(i18n?.t(project.descKey, project.desc) || project.desc);
      const href = project.pageUrl || project.url;
      const target = project.pageUrl ? '' : ' target="_blank" rel="noopener noreferrer"';
      return `
        <a class="work-card reveal" style="--delay:${index * 80}ms" href="${escapeHtml(href)}"${target} data-burst>
          <picture>
            <source srcset="${escapeHtml(project.image)}" type="image/webp" />
            <img src="assets/img/tameen-logo.jpeg" alt="${title}" class="work-logo" loading="lazy" decoding="async" />
          </picture>
          <div class="work-text">
            <span class="project-status">${escapeHtml(project.status || 'LIVE')}</span>
            <strong data-i18n="${escapeHtml(project.titleKey)}">${title}</strong>
            <span data-i18n="${escapeHtml(project.descKey)}">${desc}</span>
          </div>
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </a>
      `;
    }).join('');
  }

  function renderAll() {
    renderHeroActions();
    renderFilters();
    renderSocialLinks();
    renderCopyRows();
    renderProjects();
    i18n?.applyLanguage(i18n.getSavedLanguage());
    renderVersionModal();
    updateSmartStatus();
  }

  function applyFilter() {
    // No visual filtering in this build. All social cards stay visible.
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message || i18n?.t('copied', 'تم النسخ ✓') || 'تم النسخ ✓';
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1700);
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  async function copyText(text, btn) {
    const value = String(text || '');
    if (!value) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temp = document.createElement('textarea');
        temp.value = value;
        temp.setAttribute('readonly', '');
        temp.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      if (btn) {
        btn.classList.add('is-copied');
        const original = btn.textContent;
        btn.textContent = i18n?.t('copied', 'تم النسخ ✓') || 'تم النسخ ✓';
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (btn.matches('[data-i18n="copyBtn"]')) btn.textContent = i18n?.t('copyBtn', 'نسخ') || 'نسخ';
          else btn.textContent = original;
        }, 1200);
      }
      showToast(i18n?.t('copied', 'تم النسخ ✓'));
    } catch (_) {
      showToast('تعذر النسخ');
    }
  }

  function openShare() {
    const overlay = $('#shareOverlay');
    const input = $('#shareUrlInput');
    const qr = $('#shareQrImg');
    if (!overlay) return;
    const url = site.baseUrl || location.href;
    if (input) input.value = url;
    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeShare() {
    const overlay = $('#shareOverlay');
    if (!overlay) return;
    if (!overlay.classList.contains('show')) return;
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.classList.remove('show', 'is-closing');
      overlay.setAttribute('aria-hidden', 'true');
      unlockBodyIfClean();
    }, 360);
  }

  async function nativeSharePage() {
    const url = site.baseUrl || location.href;
    const shareData = {
      title: i18n?.t('shareNativeTitle', 'Omar Profiles') || 'Omar Profiles',
      text: i18n?.t('shareNativeText', 'Omar Profiles links and projects in one place.') || 'Omar Profiles links and projects in one place.',
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast(i18n?.t('shared', 'تم فتح المشاركة ✓'));
      } else {
        await copyText(`${shareData.text}\n${url}`);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        await copyText(`${shareData.text}\n${url}`);
      }
    }
  }

  async function shareToTarget(target) {
    const url = site.baseUrl || location.href;
    const text = i18n?.t('shareWhatsAppText', 'Omar Profiles') || 'Omar Profiles';
    if (target === 'whatsapp') {
      open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    await copyText(`${text}\n${url}`);
    showToast(i18n?.t('shareFallbackCopied', 'Link copied. Paste it in the app you want.'));
  }

  function renderVersionModal() {
    const release = site.release || {};
    const lang = i18n?.lang || 'ar';
    const title = $('#versionTitle');
    const subtitle = $('#versionSubtitle');
    const date = $('#versionDate');
    const list = $('#versionList');
    const badge = $('#versionBadge');
    const github = $('#versionGithub');
    const versionText = `${release.version || 'v9 Preview'} • ${release.name || 'Portfolio Upgrade'}`;
    if (badge) badge.textContent = versionText;
    if (title) title.textContent = release.version || 'v9 Preview';
    if (subtitle) subtitle.textContent = release.name || 'Portfolio Upgrade';
    if (date) date.textContent = release.date || '2026-06-18';
    const changes = lang === 'en' ? release.changesEn : release.changesAr;
    if (list) list.innerHTML = (changes || []).slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    if (github && release.githubUrl) github.href = release.githubUrl;
  }

  function openVersion() {
    renderVersionModal();
    const overlay = $('#versionOverlay');
    if (!overlay) return;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeVersion() {
    const overlay = $('#versionOverlay');
    if (!overlay) return;
    if (!overlay.classList.contains('show')) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    unlockBodyIfClean();
  }

  function openDiscord() {
    const overlay = $('#pageOverlay');
    const frame = $('#pageFrame');
    if (!overlay || !frame) return;
    frame.src = site.discordPage || 'pages/discord.html';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeDiscord() {
    const overlay = $('#pageOverlay');
    const frame = $('#pageFrame');
    if (!overlay || !frame) return;
    if (!overlay.classList.contains('show')) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    frame.src = '';
    unlockBodyIfClean();
  }

  function unlockBodyIfClean() {
    if (!$('#shareOverlay')?.classList.contains('show') && !$('#pageOverlay')?.classList.contains('show') && !$('#versionOverlay')?.classList.contains('show')) {
      document.body.classList.remove('modal-open');
    }
  }

  function makeRipple(target, event) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function flowerBurst(x, y, amount = 9) {
    amount = state.lowPower ? Math.min(3, amount) : amount;
    if (!amount) return;
    const colors = ['#5bf6ff', '#14e7c0', '#ff3d8e', '#f8ff00', '#8b5cf6', '#ffffff'];
    for (let i = 0; i < amount; i += 1) {
      const petal = document.createElement('span');
      petal.className = 'flower-petal';
      const angle = (Math.PI * 2 * i) / amount + Math.random() * .35;
      const distance = 42 + Math.random() * 58;
      petal.style.left = `${x}px`;
      petal.style.top = `${y}px`;
      petal.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      petal.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      petal.style.setProperty('--spin', `${180 + Math.random() * 280}deg`);
      petal.style.setProperty('--rot', `${Math.random() * 360}deg`);
      petal.style.setProperty('--petal-color', colors[i % colors.length]);
      document.body.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove(), { once: true });
    }
  }

  function streakBurst(x, y, amount = 7) {
    amount = state.lowPower ? Math.min(3, amount) : amount;
    if (!amount) return;
    const colors = ['#5bf6ff', '#14e7c0', '#ff3d8e', '#f8ff00', '#8b5cf6'];
    for (let i = 0; i < amount; i += 1) {
      const streak = document.createElement('span');
      streak.className = 'neon-streak';
      const angle = ((Math.PI * 2) / amount) * i + (Math.random() * .32 - .16);
      const distance = 22 + Math.random() * 34;
      streak.style.left = `${x}px`;
      streak.style.top = `${y}px`;
      streak.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      streak.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      streak.style.setProperty('--rot', `${angle}rad`);
      streak.style.setProperty('--streak-color', colors[i % colors.length]);
      document.body.appendChild(streak);
      streak.addEventListener('animationend', () => streak.remove(), { once: true });
    }
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -20px' });
    const mobileReveal = matchMedia('(max-width: 560px)').matches;
    const delayStep = mobileReveal ? 62 : 45;
    const maxDelay = mobileReveal ? 620 : 420;
    items.forEach((el, index) => {
      if (!el.style.getPropertyValue('--delay')) el.style.setProperty('--delay', `${Math.min(index * delayStep, maxDelay)}ms`);
      observer.observe(el);
    });
  }

  function initTilt() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;
    document.addEventListener('pointermove', (event) => {
      const ev = event.target.closest?.('.evc-root');
      if (ev) {
        const evRect = ev.getBoundingClientRect();
        ev.style.setProperty('--mx', `${event.clientX - evRect.left}px`);
        ev.style.setProperty('--my', `${event.clientY - evRect.top}px`);
      }
      const card = event.target.closest?.('.social-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--ry', `${x * -8}deg`);
      card.style.setProperty('--rx', `${y * 7}deg`);
    });
    document.addEventListener('pointerleave', (event) => {
      const card = event.target.closest?.('.social-card');
      if (!card) return;
      card.style.removeProperty('--ry');
      card.style.removeProperty('--rx');
    }, true);
  }


  function getLocalDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function chooseEveningStatus() {
    const choices = ['online', 'coding', 'gaming'];
    const key = `omar_evening_status_${getLocalDateKey()}`;
    try {
      const saved = localStorage.getItem(key);
      if (choices.includes(saved)) return saved;
      const picked = choices[Math.floor(Math.random() * choices.length)];
      localStorage.setItem(key, picked);
      return picked;
    } catch (_) {
      return choices[Math.floor(Math.random() * choices.length)];
    }
  }

  function getSmartStatusKey() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 8) return 'sleeping';
    if (hour >= 8 && hour < 18) return 'busy';
    return chooseEveningStatus();
  }

  function updateSmartStatus() {
    const key = getSmartStatusKey();
    const config = site.smartStatuses?.[key] || site.smartStatuses?.busy || { labelKey: 'statusBusy', bg: 'stars', color: '#00eaff' };
    const statusEl = $('#statusText') || $('.status');
    if (statusEl) {
      statusEl.textContent = i18n?.t(config.labelKey, key.toUpperCase()) || key.toUpperCase();
      statusEl.dataset.status = key;
      statusEl.setAttribute('aria-label', statusEl.textContent);
    }
    state.currentStatus = key;
    document.body.dataset.status = key;
    document.body.style.setProperty('--status-color', config.color || '#00eaff');
    document.body.style.setProperty('--status-glow', config.glow || 'rgba(0,234,255,.45)');
    ['bg-mode-sleep','bg-mode-stars','bg-mode-aurora','bg-mode-coding','bg-mode-gaming'].forEach((name) => document.body.classList.remove(name));
    document.body.classList.add(`bg-mode-${config.bg || 'aurora'}`);
  }

  function initSmartStatus() {
    updateSmartStatus();
    setInterval(updateSmartStatus, 60 * 1000);
    document.addEventListener('omar:languagechange', updateSmartStatus);
  }

  function detectLowPowerMode() {
    const mobile = matchMedia('(max-width: 620px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const memory = Number(navigator.deviceMemory || 8);
    const cores = Number(navigator.hardwareConcurrency || 8);
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNet = connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType));
    const low = Boolean(mobile && (memory <= 3 || cores <= 4 || slowNet));
    state.lowPower = low;
    document.body.classList.toggle('low-power-mode', low);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('user-reduced-motion');
    }
  }

  function initMagneticButtons() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || state.lowPower) return;
    document.addEventListener('pointermove', (event) => {
      const target = event.target.closest?.('.magnetic, .hero-action, .native-share-btn, .share-copy-btn, .lang-toggle');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      target.style.setProperty('--mag-x', `${x * 9}px`);
      target.style.setProperty('--mag-y', `${y * 7}px`);
    });
    document.addEventListener('pointerleave', (event) => {
      const target = event.target.closest?.('.magnetic, .hero-action, .native-share-btn, .share-copy-btn, .lang-toggle');
      if (!target) return;
      target.style.removeProperty('--mag-x');
      target.style.removeProperty('--mag-y');
    }, true);
  }

  function initProfilePopover() {
    const avatar = $('#avatarBtn');
    const popover = $('#profilePopover');
    if (!avatar || !popover) return;
    avatar.addEventListener('click', () => {
      popover.classList.add('show');
      clearTimeout(state.profileTimer);
      state.profileTimer = setTimeout(() => popover.classList.remove('show'), 5000);
    });
    document.addEventListener('click', (event) => {
      if (!popover.classList.contains('show')) return;
      if (event.target.closest('#avatarBtn') || event.target.closest('#profilePopover')) return;
      popover.classList.remove('show');
    });
  }

  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const value = Math.min(100, Math.max(0, (scrollY / max) * 100));
      bar.style.transform = `scaleX(${value / 100})`;
    };
    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate);
    update();
  }

  function shuffleArray(values) {
    const arr = values.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function rebuildAyahOrder(avoidIndex = -1) {
    const list = site.ayahs || [];
    const indexes = list.map((_, index) => index);
    state.ayahOrder = shuffleArray(indexes);
    if (state.ayahOrder.length > 1 && state.ayahOrder[0] === avoidIndex) {
      state.ayahOrder.push(state.ayahOrder.shift());
    }
    state.ayahPointer = 0;
  }

  function nextAyahIndex() {
    const list = site.ayahs || [];
    if (!list.length) return 0;
    if (!state.ayahOrder.length || state.ayahPointer >= state.ayahOrder.length) {
      rebuildAyahOrder(state.ayahIndex);
    }
    const next = state.ayahOrder[state.ayahPointer];
    state.ayahPointer += 1;
    return next;
  }

  function nextAyahDelay() {
    const isDetail = $('#ayahFloat')?.classList.contains('is-detail');
    const min = isDetail ? 45000 : 18000;
    const range = isDetail ? 20000 : 11000;
    return min + Math.floor(Math.random() * range);
  }

  function restartAyahRing(delay) {
    const card = $('#ayahFloat');
    const ring = $('#ayahRing');
    if (!card || !ring) return;
    state.ayahDelay = delay;
    card.style.setProperty('--ayah-duration', `${delay}ms`);
    ring.classList.remove('is-running');
    void ring.offsetWidth;
    ring.classList.add('is-running');
  }

  function getCurrentAyahCopyText() {
    const list = site.ayahs || [];
    const item = list[state.ayahIndex % list.length];
    if (!item) return '';
    const ref = i18n?.lang === 'en' ? item.refEn : item.refAr;
    const category = i18n?.lang === 'en' ? item.categoryEn : item.categoryAr;
    return `${item.text}\n${ref}${category ? `\n${category}` : ''}\n${site.baseUrl || location.href}`;
  }

  function updateAyah(index) {
    const list = site.ayahs || [];
    if (!list.length) return;
    state.ayahIndex = index % list.length;
    safeStorageSet('omar_last_ayah_index', String(state.ayahIndex));
    const item = list[index % list.length];
    const lang = i18n?.lang || 'ar';
    const isEn = lang === 'en';
    const category = isEn ? item.categoryEn : item.categoryAr;
    const card = $('#ayahFloat');
    const els = {
      text: $('#ayahText'),
      translation: $('#ayahTranslation'),
      ref: $('#ayahRef'),
      note: $('#ayahNote'),
      detail: $('#ayahDetail'),
      hint: $('#ayahHint')
    };

    if (card) {
      card.dataset.category = item.category || '';
      card.classList.add('is-switching');
    }

    window.setTimeout(() => {
      if (els.text) els.text.textContent = item.text;
      if (els.translation) els.translation.textContent = item.en || '';
      if (els.ref) els.ref.textContent = isEn ? `[${item.refEn}]` : `[${item.refAr}]`;
      if (els.note) els.note.textContent = [category, isEn ? item.noteEn : item.noteAr].filter(Boolean).join(' • ');
      if (els.detail) els.detail.textContent = isEn ? (item.tafsirEn || '') : (item.tafsirAr || '');
      if (els.hint) els.hint.textContent = i18n?.t('ayahHint', isEn ? 'Tap to view tafsir' : 'اضغط لعرض تفاصيل الآية');

      if (card) {
        card.classList.remove('is-switching');
        card.classList.add('is-fresh');
        window.setTimeout(() => card.classList.remove('is-fresh'), 500);
      }
    }, card ? 105 : 0);
  }

  function alignAyahToLanguage() {
    const card = $('#ayahFloat');
    const dock = $('#ayahDock');
    if (!card) return;
    card.style.left = '';
    card.style.right = '';
    card.style.top = '';
    card.style.transform = '';
    card.classList.add('is-side-switching');
    dock?.classList.add('is-side-switching');
    window.setTimeout(() => {
      card.classList.remove('is-side-switching');
      dock?.classList.remove('is-side-switching');
    }, 520);
  }

  function scheduleNextAyah() {
    clearTimeout(state.ayahTimer);
    const card = $('#ayahFloat');
    if (card?.classList.contains('is-hidden-hard')) {
      $('#ayahRing')?.classList.remove('is-running');
      return;
    }
    const delay = nextAyahDelay();
    restartAyahRing(delay);
    state.ayahTimer = setTimeout(() => {
      if (card && !card.classList.contains('is-hidden-hard')) {
        state.ayahIndex = nextAyahIndex();
        updateAyah(state.ayahIndex);
      }
      scheduleNextAyah();
    }, delay);
  }

  function initAyah() {
    const card = $('#ayahFloat');
    const eye = $('#ayahEye');
    const dock = $('#ayahDock');
    if (!card) return;
    rebuildAyahOrder();
    const savedIndex = Number(safeStorageGet('omar_last_ayah_index'));
    state.ayahIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < (site.ayahs || []).length ? savedIndex : nextAyahIndex();
    updateAyah(state.ayahIndex);
    const savedVisibility = safeStorageGet('omar_ayah_card_state');
    const shouldShow = savedVisibility === 'shown';

    function syncAyahButtons(visible) {
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
      dock?.setAttribute('aria-expanded', visible ? 'true' : 'false');
      dock?.setAttribute('aria-label', i18n?.t('showAyah', 'إظهار الآية') || 'إظهار الآية');
      eye?.setAttribute('aria-label', i18n?.t('hideAyah', 'إخفاء الآية') || 'إخفاء الآية');
    }

    function setAyahVisible(visible, animate = true) {
      safeStorageSet('omar_ayah_card_state', visible ? 'shown' : 'hidden');
      syncAyahButtons(visible);
      clearTimeout(state.ayahTimer);
      if (visible) {
        card.classList.remove('is-hidden-hard', 'is-water-out');
        dock?.classList.remove('show');
        requestAnimationFrame(() => {
          if (animate) card.classList.add('is-water-in');
          setTimeout(() => card.classList.remove('is-water-in'), 380);
          scheduleNextAyah();
        });
        return;
      }
      card.classList.remove('is-water-in', 'is-detail');
      $('#ayahRing')?.classList.remove('is-running');
      if (!animate) {
        card.classList.add('is-hidden-hard');
        dock?.classList.add('show');
        return;
      }
      card.classList.add('is-water-out');
      setTimeout(() => {
        card.classList.add('is-hidden-hard');
        dock?.classList.add('show');
      }, 350);
    }

    setAyahVisible(shouldShow, false);

    document.addEventListener('omar:languagechange', () => { alignAyahToLanguage(); updateAyah(state.ayahIndex); });

    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (Date.now() < state.ayahClickBlockedUntil) return;
      if (state.drag?.moved) return;
      card.classList.toggle('is-detail');
      scheduleNextAyah();
    });

    eye?.addEventListener('click', (event) => { event.stopPropagation(); setAyahVisible(false); });
    dock?.addEventListener('click', () => setAyahVisible(true));
    $('#copyAyahBtn')?.addEventListener('click', (event) => {
      event.stopPropagation();
      copyText(getCurrentAyahCopyText(), event.currentTarget);
      showToast(i18n?.t('ayahCopied', 'تم نسخ الآية ✓'));
    });
    $('#newAyahBtn')?.addEventListener('click', (event) => {
      event.stopPropagation();
      state.ayahIndex = nextAyahIndex();
      updateAyah(state.ayahIndex);
      scheduleNextAyah();
    });

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      state.drag = {
        x: event.clientX,
        y: event.clientY,
        left: card.offsetLeft,
        top: card.offsetTop,
        dx: 0,
        dy: 0,
        moved: false
      };
      card.classList.add('is-dragging');
      card.setPointerCapture?.(event.pointerId);
    });

    function applyAyahDrag() {
      state.ayahDragRaf = 0;
      if (!state.drag) return;
      const maxX = innerWidth - card.offsetWidth - 8;
      const maxY = innerHeight - card.offsetHeight - 8;
      const nextLeft = Math.min(maxX, Math.max(8, state.drag.left + state.drag.dx));
      const nextTop = Math.min(maxY, Math.max(8, state.drag.top + state.drag.dy));
      card.style.transform = `translate3d(${nextLeft - state.drag.left}px, ${nextTop - state.drag.top}px, 0)`;
      state.ayahDragLast = { left: nextLeft, top: nextTop };
    }

    card.addEventListener('pointermove', (event) => {
      if (!state.drag) return;
      state.drag.dx = event.clientX - state.drag.x;
      state.drag.dy = event.clientY - state.drag.y;
      if (Math.abs(state.drag.dx) + Math.abs(state.drag.dy) > 7) state.drag.moved = true;
      if (!state.ayahDragRaf) state.ayahDragRaf = requestAnimationFrame(applyAyahDrag);
    });

    function finishAyahDrag() {
      if (state.ayahDragRaf) cancelAnimationFrame(state.ayahDragRaf);
      state.ayahDragRaf = 0;
      if (state.drag?.moved && state.ayahDragLast) {
        card.style.left = `${state.ayahDragLast.left}px`;
        card.style.right = 'auto';
        card.style.top = `${state.ayahDragLast.top}px`;
        state.ayahClickBlockedUntil = Date.now() + 180;
      }
      card.style.transform = '';
      card.classList.remove('is-dragging');
      state.drag = null;
      state.ayahDragLast = null;
    }

    card.addEventListener('pointerup', finishAyahDrag);
    card.addEventListener('pointercancel', finishAyahDrag);
  }

  function initTitleEffect() {
    const titleEl = document.querySelector('title');
    const words = site.titles || ['Omar Profiles'];
    function tick() {
      if (state.titlePaused || !titleEl) return;
      const word = words[state.titleIndex % words.length];
      state.charIndex += state.deleting ? -1 : 1;
      titleEl.textContent = word.slice(0, state.charIndex) || 'Omar Profiles';
      let speed = state.deleting ? 38 : 58;
      if (!state.deleting && state.charIndex >= word.length) { speed = 1200; state.deleting = true; }
      if (state.deleting && state.charIndex <= 0) { state.deleting = false; state.titleIndex += 1; speed = 250; }
      state.titleTimer = setTimeout(tick, speed);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        state.titlePaused = true;
        clearTimeout(state.titleTimer);
        if (titleEl) titleEl.textContent = 'لا تهرب خليكككك';
      } else {
        state.titlePaused = false;
        if (titleEl) titleEl.textContent = 'رجعت هيك 😎';
        clearTimeout(state.titleTimer);
        state.titleTimer = setTimeout(tick, 900);
      }
    });
    tick();
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const socialClick = event.target.closest?.('.social-card');
      if (state.cancelNextCardClick && socialClick) {
        event.preventDefault();
        event.stopPropagation();
        state.cancelNextCardClick = false;
        return;
      }

      const burstTarget = event.target.closest?.('[data-burst], .interactive, .social-card, .work-card, .copy-row, .evc-inner');
      if (burstTarget) {
        makeRipple(burstTarget, event);
        if (burstTarget.matches('.social-card, .hero-action, .avatar, .share-fab, .work-card, .copy-btn, .lang-toggle')) {
          if (burstTarget.matches('.lang-toggle')) {
            streakBurst(event.clientX, event.clientY, 7);
            return;
          }
          flowerBurst(event.clientX, event.clientY, burstTarget.matches('.avatar') ? 14 : 8);
        }
      }

      const action = event.target.closest?.('[data-action]')?.dataset.action;
      if (action === 'share') { event.preventDefault(); openShare(); return; }
      if (action === 'discord') { event.preventDefault(); openDiscord(); return; }

      const shareTarget = event.target.closest?.('[data-share-target]')?.dataset.shareTarget;
      if (shareTarget) { event.preventDefault(); shareToTarget(shareTarget); return; }

      const copyBtn = event.target.closest?.('[data-copy]');
      if (copyBtn) { copyText(copyBtn.dataset.copy, copyBtn); }
    });

    // Long press on cards copies the link instead of opening it. Normal click still opens.
    let longPressTimer = 0;
    let longPressTarget = null;
    document.addEventListener('pointerdown', (event) => {
      const card = event.target.closest?.('.social-card[data-copy-text]');
      if (!card) return;
      longPressTarget = card;
      longPressTimer = setTimeout(() => {
        card.classList.add('is-pressed');
        state.cancelNextCardClick = true;
        copyText(card.dataset.copyText);
        flowerBurst(event.clientX, event.clientY, 10);
        longPressTimer = 0;
      }, 650);
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'scroll'].forEach((name) => {
      document.addEventListener(name, () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = 0;
        longPressTarget?.classList.remove('is-pressed');
        longPressTarget = null;
      }, { passive: true });
    });

    $('#langToggleBtn')?.addEventListener('click', (event) => {
      const btn = event.currentTarget;
      btn.classList.add('is-switching', 'is-clicking');
      btn.style.setProperty('--click-x', `${event.clientX}px`);
      btn.style.setProperty('--click-y', `${event.clientY}px`);
      setTimeout(() => btn.classList.remove('is-switching', 'is-clicking'), 420);
      i18n?.toggleLanguage();
    });
    $('#sharePortalBtn')?.addEventListener('click', openShare);
    $('#closeShare')?.addEventListener('click', closeShare);
    $('#copyShareBtn')?.addEventListener('click', () => copyText($('#shareUrlInput')?.value, $('#copyShareBtn')));
    $('#nativeShareBtn')?.addEventListener('click', nativeSharePage);
    $('#shareOverlay')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeShare(); });
    $('#versionBadge')?.addEventListener('click', openVersion);
    $('#closeVersion')?.addEventListener('click', closeVersion);
    $('#versionOverlay')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeVersion(); });
    $('#closePageBtn')?.addEventListener('click', closeDiscord);
    $('#pageOverlay')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeDiscord(); });
    window.addEventListener('message', (event) => { if (event.data?.type === 'close-discord') closeDiscord(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { closeShare(); closeDiscord(); closeVersion(); }
      if (event.altKey && event.key.toLowerCase() === 'l') { event.preventDefault(); i18n?.toggleLanguage(); }
    });

    document.addEventListener('omar:languagechange', renderVersionModal);

    $('#avatarBtn')?.addEventListener('click', (event) => {
      const btn = event.currentTarget;
      btn.classList.add('is-popping');
      setTimeout(() => btn.classList.remove('is-popping'), 520);
    });
  }

  function init() {
    detectLowPowerMode();
    renderAll();
    bindEvents();
    initSmartStatus();
    initProfilePopover();
    initReveal();
    initTilt();
    initMagneticButtons();
    initScrollProgress();
    initAyah();
    initTitleEffect();
    const wait = Math.max(720 - (performance.now() - readyStartedAt), 0);
    setTimeout(() => requestAnimationFrame(() => document.body.classList.add('site-ready')), wait);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  const brandIcon = window.OMAR_BRANDS?.render(item);

if (brandIcon) {
  iconContainer.appendChild(brandIcon);
}
})();
