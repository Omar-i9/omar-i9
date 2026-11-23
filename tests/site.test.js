import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { translations } from '../data/translations.js';
import { copy } from '../data/copy.js';
import { socialLinks, quickCopy } from '../data/social.js';
import { projects, taamenShowcase, evShowcase } from '../data/projects.js';
import { ayahs } from '../data/ayahs.js';
import { release, siteVersionLabel } from '../data/release.js';
import { PRESENCE_TZ, PRESENCE_WEIGHTS, presenceThemes, presenceLabels, createDailySchedule, resolveSmartPresence } from '../data/presence.js';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

function allFiles(directory) {
  const entries = readdirSync(join(root, directory), { withFileTypes: true });
  return entries.flatMap((entry) => entry.isDirectory()
    ? allFiles(join(directory, entry.name))
    : [join(directory, entry.name)]);
}

test('Arabic and English dictionaries have matching keys', () => {
  assert.deepEqual(Object.keys(translations.ar).sort(), Object.keys(translations.en).sort());
  assert.deepEqual(Object.keys(copy.ar).sort(), Object.keys(copy.en).sort());
});

test('the site identity and release metadata are fixed and coherent', () => {
  assert.equal(release.version, 'v4.1.1');
  assert.match(siteVersionLabel, /Omar\|عُمَر/);
  assert.match(read('index.html'), /<title>Omar\s*\|\s*عُمَر<\/title>/);
  assert.match(read('scripts/core/i18n.js'), /document\.title = 'Omar\|عُمَر'/);
});

test('the homepage keeps core sections, sharing, the profile card, and GitHub action', () => {
  const html = read('index.html');
  for (const id of ['profileCard', 'profileVisual', 'linksGrid', 'copyList', 'projectsList', 'shareDialog']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing ${id}`);
  }
  assert.doesNotMatch(html, /id=["'](?:ayahCard|ayahDock|versionDialog|versionBadge)["']/);
  assert.match(html, /href="https:\/\/github\.com\/Omar-i9"/);
  assert.match(html, /View GitHub Profile/);
  assert.doesNotMatch(html, /github\.com\/Omar-i9\/omar-i9/);
  assert.doesNotMatch(html, /(?:star-count|>\s*6\s*<)/i, 'do not invent a repository star count');
});

test('the old social filter controls and Discord profile page are absent', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /data-filter|filter-category|social-filter|filter-tabs/i);
  assert.doesNotMatch(html, /pages\/discord\.html|discord-page/i);
  assert.equal(existsSync(join(root, 'pages/discord.html')), false);
});

test('social cards have one action per profile and every local icon exists', () => {
  assert.equal(socialLinks.length, 15);
  assert.equal(new Set(socialLinks.map((item) => item.id)).size, socialLinks.length);
  for (const item of socialLinks) {
    assert.ok(item.titleKey, `${item.id} has a translation key`);
    assert.ok(existsSync(join(root, item.icon)), `${item.id} icon exists`);
    if (item.id === 'discord') {
      assert.equal(item.action, 'copy');
      assert.equal(item.copy, 'gdmi_3');
      assert.equal(item.url, undefined);
    } else {
      assert.match(item.url, /^https:\/\//);
    }
  }
});

test('quick-copy values and their icon assets are valid', () => {
  assert.equal(quickCopy.length, 6);
  for (const item of quickCopy) {
    assert.ok(item.value);
    assert.ok(existsSync(join(root, item.icon)));
  }
});

test('TAAMEN card separates live product, development record, and internal ideas', () => {
  assert.equal(projects.find((item) => item.id === 'taamenn')?.version, 'v2.0.0');
  assert.ok(projects.some((item) => item.id === 'ev-telemetry'));
  assert.ok(taamenShowcase.features.length >= 8);
  assert.ok(taamenShowcase.timeline.some((item) => item.tag === 'V21.5'));
  assert.ok(taamenShowcase.developmentStatus.ar.some((line) => /لا تعني|لم تكن|DISABLED/i.test(line)));
  assert.ok(taamenShowcase.unannouncedTrack.ar.length >= 3);
  assert.ok(taamenShowcase.unannouncedTrack.ar.some((item) => /Shot & Goal|التسديدات/i.test(item.title)));
  assert.match(read('scripts/features/projects.js'), /data-project-pane="published"/);
  assert.match(read('scripts/features/projects.js'), /data-project-pane="development"/);
  assert.match(read('scripts/features/projects.js'), /data-project-pane="lab"/);
  assert.equal(projects.find((item) => item.id === 'taamenn')?.acquisitionUrl, undefined);
});

test('TAAMEN detail page contains no acquisition route or call-to-action', () => {
  const html = read('pages/project-taameen.html') + read('scripts/pages/taamen-page.js') + read('data/projects.js');
  assert.doesNotMatch(html, /taamenn\.com\/acquisition|SideProjectors|استحواذ|Acquisition/i);
});

test('project tabs remain accessible and preserve progressive panel transitions', () => {
  const script = read('scripts/features/projects.js');
  const css = read('styles/site.css');
  assert.match(script, /aria-selected/);
  assert.match(script, /panel\.inert/);
  assert.match(script, /previousTab/);
  assert.match(css, /grid-template-rows:\s*0fr/);
  assert.match(css, /project-card\.is-opening/);
});

test('presence schedule is deterministic per day and changes across dates', () => {
  const dayA = new Date('2026-11-16T10:00:00+02:00');
  const sameDay = new Date('2026-11-16T20:30:00+02:00');
  const dayB = new Date('2026-11-17T10:00:00+02:00');
  assert.deepEqual(createDailySchedule(dayA), createDailySchedule(sameDay));
  assert.notDeepEqual(createDailySchedule(dayA), createDailySchedule(dayB));
  assert.equal(PRESENCE_TZ, 'Asia/Hebron');
  assert.equal(Object.values(PRESENCE_WEIGHTS).reduce((sum, weight) => sum + weight, 0), 100);
});

test('presence schedule covers a complete day with bounded activity blocks', () => {
  for (let offset = 0; offset < 180; offset += 1) {
    const day = new Date(Date.UTC(2026, 0, 1 + offset, 12));
    const schedule = createDailySchedule(day);
    assert.equal(schedule[0].start, 0);
    assert.equal(schedule[0].mode, 'sleeping');
    assert.equal(schedule.at(-1).end, 1440);
    for (let index = 0; index < schedule.length; index += 1) {
      const block = schedule[index];
      assert.ok(block.end > block.start, `${block.mode} has positive duration`);
      if (index > 0) assert.equal(block.start, schedule[index - 1].end, 'schedule has no gaps or overlaps');
      if (block.mode !== 'sleeping') {
        const max = ({ studying: 138, coding: 82, gaming: 98, friends: 118, rest: 66, available: 54, football: 100 })[block.mode];
        assert.ok(block.end - block.start <= max, `${block.mode} exceeds its maximum duration`);
      }
      if (['gaming', 'football'].includes(block.mode)) assert.ok(block.start >= 15 * 60, 'gaming and football are kept in late-day hours');
    }
  }
});

test('presence resolver exposes a known theme and translation label', () => {
  const presence = resolveSmartPresence(new Date('2026-11-16T13:00:00+02:00'));
  assert.ok(presenceThemes[presence.mode]);
  assert.ok(presenceLabels[presence.mode]);
  assert.ok(presence.end > presence.minutes);
});

test('v6 status-driven Aurora background replaces the previous Canvas scene', () => {
  const html = read('index.html');
  const css = read('styles/site.css');
  const main = read('scripts/main.js');
  const presence = read('scripts/features/presence.js');
  assert.match(html, /class="bg-aurora"/);
  assert.match(html, /class="bg-grid"/);
  assert.doesNotMatch(html, /wavesCanvas|scene-backdrop/);
  assert.doesNotMatch(main, /initWavesBackground/);
  assert.match(css, /body\.bg-mode-sleep/);
  assert.match(css, /body\.bg-mode-stars/);
  assert.match(css, /body\.bg-mode-coding/);
  assert.match(css, /legacy-bg-float-blob/);
  assert.match(presence, /backgroundByPresence/);
  assert.match(presence, /bg-mode-\$\{/);
});

test('TAAMEN project card restores the v6 hover treatment without changing its panel behavior', () => {
  const css = read('styles/site.css');
  const script = read('scripts/features/projects.js');
  assert.ok(css.includes('.project-card--taamenn:hover { transform: translateY(-4px); }'));
  assert.ok(css.includes('.project-card--taamenn::after'));
  assert.ok(css.includes('.project-card--taamenn:hover::after'));
  assert.ok(css.includes('.project-card--taamenn:hover .project-logo'));
  assert.ok(css.includes('.project-card--taamenn:hover .project-state'));
  assert.ok(css.includes('.project-card--taamenn:not(.is-open):hover .project-toggle-icon'));
  assert.ok(css.includes('taamen-v6-logo-float'));
  assert.ok(css.includes('.project-card--taamenn:focus-within::after'));
  assert.match(script, /data-project-toggle/);
  assert.match(script, /openCard/);
  assert.match(script, /closeCard/);
});

test('profile opens once after the intro and never collapses on click', () => {
  const html = read('index.html');
  const script = read('scripts/features/profile.js');
  const css = read('styles/site.css');
  assert.match(html, /id="profileVisual"/);
  assert.match(html, /id="profileDetails"[^>]*aria-hidden="true" inert/);
  assert.doesNotMatch(html, /profileToggle|aria-expanded/);
  assert.match(script, /introDelay/);
  assert.match(script, /setExpanded\(false\)/);
  assert.match(script, /setExpanded\(true\)/);
  assert.match(script, /pointermove/);
  assert.match(script, /pointerleave/);
  assert.match(script, /hover: hover.*pointer: fine/);
  assert.doesNotMatch(script, /addEventListener\('click'/);
  assert.doesNotMatch(script, /addEventListener\('keydown'/);
  assert.match(css, /transform \.38s ease/);
  assert.match(css, /profile-photo-visual/);
});

test('GitHub button is a safe external link with the shine transition and no fake counter', () => {
  const html = read('index.html');
  const css = read('styles/site.css');
  assert.match(html, /github-star-shine/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(css, /github-star-shine/);
  assert.doesNotMatch(html, /starCount|stars-count|<span[^>]*>6<\/span>/i);
});

test('the V5 homepage intentionally excludes the Quran ayah widget', () => {
  const html = read('index.html');
  const main = read('scripts/main.js');
  assert.doesNotMatch(html, /ayahCard|ayahDock|ayahTafsirText|ayahCopy/);
  assert.doesNotMatch(main, /initAyah|features\\/ayah/);
  assert.ok(ayahs.length >= 10, 'the source dataset remains available but is not rendered on the homepage');
});

test('language selector has explicit Arabic and English direction and labels', () => {
  const html = read('index.html');
  const css = read('styles/site.css');
  const script = read('scripts/core/i18n.js');
  assert.match(html, /data-lang-ar dir="rtl"/);
  assert.match(html, /data-lang-en dir="ltr"/);
  assert.match(css, /\.language-switch\s*\{[^}]*direction:\s*ltr/s);
  assert.match(script, /html\.dir = activeLang/);
});

test('release information is intentionally omitted from the V5 homepage', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /versionDialog|versionBadge|version-list/);
});

test('site background and foreground cards have clear contrasting surfaces', () => {
  const css = read('styles/site.css');
  assert.match(css, /\.bg-grid/);
  assert.match(css, /#080c15/);
  assert.match(css, /rgba\(255,255,255/);
  assert.match(css, /--brand/);
  assert.match(css, /prefers-reduced-motion/);
});

test('Quran card data is complete and bilingual', () => {
  assert.ok(ayahs.length >= 10);
  for (const item of ayahs) {
    for (const key of ['text', 'refAr', 'refEn', 'en', 'noteAr', 'noteEn', 'tafsirAr', 'tafsirEn']) {
      assert.ok(item[key], `ayah item is missing ${key}`);
    }
  }
});

test('all social SVGs are valid basic XML and use an accessible viewBox', () => {
  const files = allFiles('assets/icons/social').filter((file) => file.endsWith('.svg'));
  assert.ok(files.length >= socialLinks.length);
  for (const file of files) {
    const svg = read(file);
    assert.match(svg, /<svg\b/);
    assert.match(svg, /viewBox=/i);
    assert.match(svg, /<\/svg>\s*$/);
    assert.doesNotMatch(svg, /<script\b|onload\s*=/i);
  }
});

test('every standalone page has the same identity and background engine', () => {
  for (const page of ['pages/project-taameen.html', 'pages/project-ev.html']) {
    const html = read(page);
    assert.match(html, /Omar\|عُمَر/);
    assert.match(html, /class="bg-aurora"/);
    assert.match(html, /class="bg-grid"/);
    assert.doesNotMatch(html, /wavesCanvas/);
    assert.match(html, /language-switch/);
    assert.match(html, /\.\.\/styles\/site\.css/);
  }
});

test('there are no leftover gravity, wormhole, or old patch stylesheet modules', () => {
  const scripts = allFiles('scripts').join('\n');
  const css = allFiles('styles').join('\n');
  assert.doesNotMatch(scripts, /wormhole|gravity-well|MutationObserver|setInterval\(/i);
  assert.doesNotMatch(css, /wormhole|gravity-well/);
  assert.equal(existsSync(join(root, 'styles/v3.3-smooth-grid.css')), false);
  assert.equal(existsSync(join(root, 'styles/refinement.css')), false);
});


test('Thmanyah font files are bundled locally and referenced by CSS without external font CDNs', () => {
  const css = read('styles/site.css');
  for (const file of [
    'thmanyahsans-Regular.woff2',
    'thmanyahsans-Medium.woff2',
    'thmanyahsans-Bold.woff2',
    'thmanyahsans-Black.woff2',
    'thmanyahseriftext-Regular.woff2',
    'thmanyahseriftext-Bold.woff2'
  ]) assert.ok(existsSync(join(root, 'assets/fonts', file)), `${file} is bundled`);
  assert.ok(existsSync(join(root, 'assets/fonts/LICENSE.pdf')));
  assert.match(css, /font-family:\s*'Thmanyah Sans'/);
  assert.match(css, /font-family:\s*'Thmanyah Serif Text'/);
  assert.doesNotMatch(read('index.html'), /fonts\.googleapis\.com/);
});

test('official metadata tags are present and the profile bio is formal in both languages', () => {
  const html = read('index.html');
  assert.match(html, /name="keywords"/);
  assert.match(html, /name="author"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /property="og:site_name"/);
  assert.match(translations.ar.profileBio, /المرحلة الثانوية/);
  assert.match(translations.en.profileBio, /secondary-school student/);
  assert.doesNotMatch(translations.ar.profileBio, /ألطم|مراكم/);
});

test('daily status is presented as the activity only, without prefix or schedule metadata', () => {
  const html = read('index.html');
  const status = html.match(/<div class="profile-status-row"[\s\S]*?<\/div>/)?.[0] || '';
  assert.match(status, /id="statusText"/);
  assert.match(status, /status-indicator/);
  assert.doesNotMatch(status, /status-prefix|status-until|status-schedule-note|حالة اليوم|جدول يومي/);
});

test('dynamic Quick Copy cards re-register with the reveal observer after language changes', () => {
  const script = read('scripts/features/quick-copy.js');
  assert.match(script, /import \{ clearReveals, observeReveals \}/);
  assert.match(script, /clearReveals\(list\)/);
  assert.match(script, /observeReveals\(list\)/);
  const projectsScript = read('scripts/features/projects.js');
  assert.match(projectsScript, /clearReveals\(list\)/);
  assert.match(projectsScript, /observeReveals\(list\)/);
  const reveal = read('scripts/core/reveal.js');
  assert.match(reveal, /export function clearReveals/);
  assert.match(reveal, /observer\?\.unobserve/);
});

test('profile intro curtain and delayed profile expansion run without hover-triggered opening', () => {
  const html = read('index.html');
  const script = read('scripts/features/profile.js');
  const css = read('styles/site.css');
  assert.match(html, /site-intro-curtain/);
  assert.match(script, /1450/);
  assert.match(script, /setExpanded\(true\)/);
  assert.match(script, /details\.inert = !expanded/);
  assert.match(html, /id="profileDetails"[^>]*aria-hidden="true" inert/);
  assert.match(css, /site-intro-fade 1\.42s/);
  assert.match(css, /identity-card\.is-expanded/);
  assert.doesNotMatch(css, /identity-card:(?:hover|focus-within)/, 'profile card must not expand from hover or focus alone');
});

test('GitHub Pages support files and sitemap routes are complete', () => {
  assert.ok(existsSync(join(root, '.nojekyll')));
  assert.ok(existsSync(join(root, 'manifest.json')));
  assert.ok(existsSync(join(root, 'robots.txt')));
  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /omar-i9\.github\.io\/omar-i9\//);
  assert.match(sitemap, /pages\/project-taameen\.html/);
  assert.match(sitemap, /pages\/project-ev\.html/);
});


test('language updates description metadata and Open Graph locale', () => {
  const script = read('scripts/core/i18n.js');
  assert.match(script, /meta\[property=\"og:description\"\]/);
  assert.match(script, /meta\[name=\"twitter:description\"\]/);
  assert.match(script, /ogLocale\.content = activeLang === 'ar' \? 'ar_PS' : 'en_US'/);
});

test('glass cards remain milky translucent with blurred background and dark button edges', () => {
  const css = read('styles/site.css');
  assert.match(css, /rgba\(255,255,255,\.56\)/);
  assert.match(css, /backdrop-filter: blur\(20px\) saturate\(158%\)/);
  assert.match(css, /box-shadow: 0 5px 14px rgba\(0,0,0,\.34\)/);
});

test('profile details are inaccessible while collapsed and profile opens only through its state class', () => {
  const html = read('index.html');
  const profile = read('scripts/features/profile.js');
  const css = read('styles/site.css');
  assert.match(html, /id="profileDetails"[^>]*aria-hidden="true" inert/);
  assert.match(profile, /details\.inert = !expanded/);
  assert.match(profile, /details\.setAttribute\('aria-hidden'/);
  assert.doesNotMatch(css, /identity-card:(?:hover|focus-within)/);
});

test('all published HTML pages use bundled typefaces without remote font requests', () => {
  const pages = ['index.html', '404.html', 'pages/project-taameen.html', 'pages/project-ev.html'];
  for (const page of pages) {
    const html = read(page);
    assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/i, `${page} must not request external fonts`);
  }
  const css = read('styles/fonts.css');
  assert.match(css, /thmanyahsans-Regular\.woff2/);
});


test('Thmanyah fonts are local, preloaded, cache-busted, and applied to every HTML entry point', () => {
  const fontCss = read('styles/fonts.css');
  assert.match(fontCss, /font-family: 'Thmanyah Sans'/);
  assert.match(fontCss, /font-family: 'Thmanyah Serif Text'/);
  for (const file of ['index.html', '404.html', 'pages/project-taameen.html', 'pages/project-ev.html']) {
    const html = read(file);
    assert.match(html, /styles\/fonts\.css\?v=4\.1\.1/);
    assert.match(html, /styles\/site\.css\?v=4\.1\.1/);
    assert.match(html, /thmanyahsans-Regular\.woff2" as="font" type="font\/woff2" crossorigin/);
  }
  for (const file of [
    'assets/fonts/thmanyahsans-Regular.woff2',
    'assets/fonts/thmanyahsans-Medium.woff2',
    'assets/fonts/thmanyahsans-Bold.woff2',
    'assets/fonts/thmanyahsans-Black.woff2',
    'assets/fonts/thmanyahseriftext-Regular.woff2',
    'assets/fonts/thmanyahseriftext-Bold.woff2'
  ]) {
    assert.ok(existsSync(join(root, file)), `${file} exists`);
    assert.ok(readFileSync(join(root, file)).byteLength > 30000, `${file} is not an empty placeholder`);
  }
});

test('text on translucent white cards uses dark high-contrast colors', () => {
  const css = read('styles/site.css');
  assert.match(css, /\.copy-card \.copy-meta > span[\s\S]*?color: var\(--glass-text-strong\)/);
  assert.match(css, /\.social-card \.social-handle[\s\S]*?color: #1d2939/);
  assert.match(css, /\.project-card \.project-card-subtitle[\s\S]*?color: var\(--glass-text-muted\)/);
  assert.match(css, /\.dialog-shell #versionDate \{ color: #263449/);
  assert.match(css, /background-image: linear-gradient\(138deg, rgba\(255,255,255,\.82\)/);
  assert.match(css, /prefers-reduced-transparency: reduce/);
});


test('primary and supporting text colors meet WCAG AA contrast on pale glass cards', () => {
  const luminance = (hex) => {
    const values = hex.replace('#', '').match(/.{2}/g).map((part) => parseInt(part, 16) / 255);
    const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (foreground, background) => {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const glassBase = '#aeb4bc';
  for (const color of ['#0b1220', '#111827', '#172235', '#1d2939', '#263449', '#344256']) {
    assert.ok(contrast(color, glassBase) >= 4.5, `${color} must meet WCAG AA for normal text`);
  }
});


test('V5 homepage defines the complete scroll scene sequence and direct actions', () => {
  const html = read('index.html');
  const main = read('scripts/main.js');
  const scroll = read('scripts/features/scroll-experience.js');
  const css = read('styles/v5-experience.css');
  for (const scene of ['identity', 'social', 'gaming', 'projects', 'contact']) {
    assert.match(html, new RegExp('data-v5-scene="' + scene + '"'));
    assert.match(css, new RegExp('data-v5-scene="' + scene + '"'));
  }
  assert.match(main, /initScrollExperience/);
  assert.match(scroll, /prefersReducedMotion/);
  assert.match(scroll, /IntersectionObserver/);
  assert.match(scroll, /data-v5-magnetic/);
  assert.match(html, /data-v5-share/);
  assert.match(html, /id="shareDialog"/);
});

test('V5 homepage remains mobile-first and does not force horizontal scrolling', () => {
  const css = read('styles/v5-experience.css');
  assert.match(css, /max-width: 640px/);
  assert.match(css, /max-width: 380px/);
  assert.match(css, /pointer: coarse/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /overflow-x: clip/);
});
