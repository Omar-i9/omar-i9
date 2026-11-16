import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist']);
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(join(directory, entry.name));
      continue;
    }
    if (/\.(?:js|mjs)$/.test(entry.name)) files.push(join(directory, entry.name));
  }
}

walk(root);
let failed = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed += 1;
    process.stderr.write(`\n[syntax error] ${relative(root, file)}\n${result.stderr || result.stdout}`);
  }
}
if (failed) {
  process.stderr.write(`\n${failed}/${files.length} JavaScript files failed syntax validation.\n`);
  process.exit(1);
}
process.stdout.write(`JavaScript syntax: PASS (${files.length} files)\n`);
