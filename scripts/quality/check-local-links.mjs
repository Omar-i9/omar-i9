import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';

const root = resolve('.');
const htmlFiles = [];
const cssFiles = [];
const failures = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (extname(entry.name).toLowerCase() === '.html') htmlFiles.push(absolute);
    else if (extname(entry.name).toLowerCase() === '.css') cssFiles.push(absolute);
  }
}

walk(root);
const attrPattern = /\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi;
const idPattern = /\bid\s*=\s*(["'])(.*?)\1/gi;

for (const absoluteHtml of htmlFiles) {
  const htmlFile = absoluteHtml.slice(root.length + 1);
  const html = readFileSync(absoluteHtml, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(idPattern)) {
    const id = match[2].trim();
    if (!id) continue;
    if (ids.has(id)) failures.push(`${htmlFile}: duplicate id "${id}"`);
    ids.add(id);
  }

  for (const match of html.matchAll(attrPattern)) {
    const raw = match[2].trim();
    if (!raw || raw.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
    const pathPart = raw.split(/[?#]/, 1)[0];
    if (!pathPart) continue;
    let decoded;
    try { decoded = decodeURIComponent(pathPart); }
    catch { failures.push(`${htmlFile}: malformed URL encoding in "${raw}"`); continue; }
    const target = decoded.startsWith('/') ? resolve(root, `.${decoded}`) : resolve(dirname(absoluteHtml), decoded);
    if (target !== root && !target.startsWith(root + sep)) {
      failures.push(`${htmlFile}: local path escapes project root: ${raw}`);
      continue;
    }
    if (!existsSync(target)) failures.push(`${htmlFile}: missing local resource "${raw}"`);
  }
}


// CSS assets (especially locally bundled fonts) are resolved relative to each stylesheet.
const cssUrlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
for (const absoluteCss of cssFiles) {
  const cssFile = absoluteCss.slice(root.length + 1);
  const css = readFileSync(absoluteCss, 'utf8');
  for (const match of css.matchAll(cssUrlPattern)) {
    const raw = match[2].trim();
    if (!raw || raw.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
    const pathPart = raw.split(/[?#]/, 1)[0];
    if (!pathPart) continue;
    let decoded;
    try { decoded = decodeURIComponent(pathPart); }
    catch { failures.push(`${cssFile}: malformed CSS asset URL "${raw}"`); continue; }
    const target = decoded.startsWith('/') ? resolve(root, `.${decoded}`) : resolve(dirname(absoluteCss), decoded);
    if (target !== root && !target.startsWith(root + sep)) {
      failures.push(`${cssFile}: CSS asset path escapes project root: ${raw}`);
      continue;
    }
    if (!existsSync(target)) failures.push(`${cssFile}: missing CSS asset "${raw}"`);
  }
}

if (!htmlFiles.length) failures.push('No HTML documents found.');
if (failures.length) {
  process.stderr.write(`${failures.map((item) => `- ${item}`).join('\n')}\n`);
  process.stderr.write(`Local resource check: FAIL (${failures.length} issue(s))\n`);
  process.exit(1);
}
process.stdout.write(`Local resource check: PASS (${htmlFiles.length} HTML pages and ${cssFiles.length} CSS files inspected)\n`);
