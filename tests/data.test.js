import test from 'node:test';
import assert from 'node:assert/strict';
import { socialLinks, gamingIdentifiers, footerSocials } from '../src/data/social.js';
import { projects } from '../src/data/projects.js';
import { translations } from '../src/data/translations.js';

test('all fifteen repository social destinations and their original SVGs are listed', () => {
  assert.deepEqual(socialLinks.map((item) => item.id), [
    'instagram', 'snapchat', 'github', 'tiktok', 'discord', 'facebook', 'chess', 'steam',
    'spotify', 'rockstar', 'itch', 'linkedin', 'nexusmods', 'pinterest', 'twitch'
  ]);
  for (const item of socialLinks) {
    assert.ok(item.name && item.handle && item.icon);
    assert.match(item.icon, /^https:\/\/raw\.githubusercontent\.com\/Omar-i9\/omar-i9\/main\/assets\/icons\/social\/.+\.svg$/);
    if (item.id === 'discord') assert.equal(item.copy, 'gdmi_3');
    else assert.match(item.url, /^https:\/\//);
  }
  assert.equal(socialLinks.find((item) => item.id === 'pinterest')?.handle, 'gdmi33');
  assert.equal(socialLinks.find((item) => item.id === 'nexusmods')?.handle, 'gdmi33');
});

test('footer keeps only Instagram, Snapchat and GitHub shortcuts', () => {
  assert.deepEqual(footerSocials.map((item) => item.id), ['instagram', 'snapchat', 'github']);
});

test('all six gaming identifiers from the repository remain copyable', () => {
  assert.deepEqual(gamingIdentifiers.map((item) => item.id), ['steam-friend', 'epic', 'ubisoft', 'ea', 'playstation', 'tlauncher']);
  for (const item of gamingIdentifiers) {
    assert.ok(item.name && item.value);
    assert.match(item.icon, /^https:\/\/raw\.githubusercontent\.com\/Omar-i9\/omar-i9\/main\/assets\/icons\/gaming\/.+\.svg$/);
  }
});

test('TAAMEN is the only showcased project and separates live and information routes', () => {
  assert.equal(projects.length, 1);
  assert.equal(projects[0].id, 'taamen');
  assert.equal(projects[0].version, '2.1');
  assert.match(projects[0].status.ar, /قادمة قريباً/);
  assert.equal(projects[0].features.length, 4);
  assert.equal(projects[0].liveUrl, 'https://taamenn.com/');
  assert.equal(projects[0].detailsUrl, './projects/taamen.html');
});

test('Arabic and English interface strings include the requested final sentence', () => {
  for (const lang of ['ar', 'en']) {
    assert.ok(translations[lang].socialHeading);
    assert.ok(translations[lang].gamingHeading);
    assert.ok(translations[lang].projectVisit);
    assert.ok(translations[lang].projectDetails);
  }
  assert.equal(translations.ar.contactHeading, 'كل الطرق تؤدي إلى روما');
  assert.equal(translations.ar.contactDescription, 'سواء بدك تتواصل، تتعرف على شغلي، أو تتابع مشاريعي القادمة — كل الطرق تؤدي إلى روما.');
  assert.equal(translations.en.contactHeading, 'All roads lead to Rome');
});
