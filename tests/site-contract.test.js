import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('site has five focused scenes and restores direct sharing without a navigation bar', () => {
  const html = read('index.html');
  for (const scene of ['identity', 'social', 'gaming', 'projects', 'contact']) assert.match(html, new RegExp(`data-scene="${scene}"`));
  assert.match(html, /id="shareButton"/);
  assert.match(html, /id="shareDialog"/);
  assert.match(html, /id="shareQrCanvas"/);
  assert.match(html, /id="nativeShareButton"/);
  assert.match(html, /id="copyShareButton"/);
  assert.doesNotMatch(html, /EV TELEMETRY|<nav\b/i);
  assert.match(html, /id="languageToggle"/);
  assert.match(html, /<title>Omarr<\/title>/);
  assert.match(html, /سواء بدك تتواصل، تتعرف على شغلي، أو تتابع مشاريعي القادمة — كل الطرق تؤدي إلى روما/);
});

test('profile uses the real repository photograph and includes desktop pointer repulsion', () => {
  const html = read('index.html');
  const scene = read('src/features/scene-engine.js');
  const css = read('src/styles/hero.css');
  assert.match(html, /assets\/img\/profile\.webp/);
  assert.match(html, /assets\/img\/profile\.jpeg/);
  assert.match(scene, /initMagneticProfile/);
  assert.match(scene, /card-shift-x/);
  assert.match(scene, /card-rotate-y/);
  assert.match(css, /transform: translate3d\(var\(--card-shift-x\)/);
  assert.match(css, /is-pointer-active/);
});

test('TAAMEN uses the supplied opaque brand and has separate live and information actions', () => {
  const component = read('src/components/project-grid.js');
  const page = read('projects/taamen.html');
  assert.match(component, /taamen-brand-opaque\.webp/);
  assert.match(component, /project\.liveUrl/);
  assert.match(component, /project\.detailsUrl/);
  assert.match(page, /https:\/\/taamenn\.com\//);
  assert.match(page, /AI assistant|المساعد الذكي/);
  assert.ok(existsSync(resolve(root, 'public/visuals/taamen-brand-opaque.webp')));
});

test('supplied TAAMEN image replaced the old generated tab icon', () => {
  const html = read('index.html');
  assert.match(html, /assets\/favicon\.png/);
  assert.ok(existsSync(resolve(root, 'public/assets/favicon.png')));
  assert.ok(existsSync(resolve(root, 'public/assets/apple-touch-icon.png')));
  assert.equal(existsSync(resolve(root, 'public/assets/favicon.svg')), false);
});

test('scene choreography uses fade and restrained blur without slide-up entrances', () => {
  const scene = read('src/features/scene-engine.js');
  const css = read('src/styles/scenes.css');
  assert.match(scene, /getBoundingClientRect/);
  assert.match(scene, /--scene-focus/);
  assert.match(css, /opacity: var\(--scene-focus/);
  assert.doesNotMatch(css, /translateY\(/);
  assert.match(read('src/styles/responsive.css'), /prefers-reduced-motion:\s*reduce/);
});

test('aurora keeps the supplied image and adds animated ribbons centered in the viewport', () => {
  const html = read('index.html');
  const ambient = read('src/styles/ambient.css');
  assert.match(html, /aurora-background\.webp/);
  assert.match(html, /aurora-ribbons/);
  assert.match(ambient, /aurora-current-a/);
  assert.match(ambient, /aurora-current-b/);
  assert.match(ambient, /--pointer-x/);
  assert.ok(existsSync(resolve(root, 'public/visuals/aurora-background.webp')));
});

test('details page is part of the Vite build and sitemap', () => {
  const vite = read('vite.config.js');
  const sitemap = read('public/sitemap.xml');
  assert.match(vite, /projects\/taamen\.html/);
  assert.match(sitemap, /projects\/taamen\.html/);
});

test('site remains a static Vite app with local QR generation', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts.dev.startsWith('vite'), true);
  assert.equal(pkg.scripts.build, 'vite build');
  assert.equal(pkg.scripts.check.includes('node'), true);
  assert.ok(pkg.dependencies.qrcode);
  assert.ok(pkg.devDependencies.vite);
  assert.ok(existsSync(resolve(root, 'vite.config.js')));
});
