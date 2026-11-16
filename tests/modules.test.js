import test from 'node:test';
import assert from 'node:assert/strict';

const modules = [
  '../data/ayahs.js',
  '../data/copy.js',
  '../data/presence.js',
  '../data/projects.js',
  '../data/release.js',
  '../data/social.js',
  '../data/translations.js',
  '../scripts/core/dom.js',
  '../scripts/core/i18n.js',
  '../scripts/core/dialogs.js',
  '../scripts/core/reveal.js',
  '../scripts/core/toast.js',
  '../scripts/core/icons.js',
  '../scripts/background/waves.js',
  '../scripts/features/ayah.js',
  '../scripts/features/presence.js',
  '../scripts/features/profile.js',
  '../scripts/features/projects.js',
  '../scripts/features/quick-copy.js',
  '../scripts/features/sharing.js',
  '../scripts/features/social.js',
  '../scripts/features/version.js',
];

test('all data, core, background, and feature modules import without missing exports', async () => {
  const loaded = await Promise.all(modules.map((specifier) => import(specifier)));
  assert.equal(loaded.length, modules.length);
  for (const module of loaded) assert.ok(module && typeof module === 'object');
});

test('main and standalone page entrypoints resolve every imported module', async () => {
  const previousDocument = globalThis.document;
  globalThis.document = {
    readyState: 'loading',
    addEventListener() {},
  };
  try {
    await import('../scripts/main.js');
    await import('../scripts/pages/taamen-page.js');
    await import('../scripts/pages/ev-page.js');
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
