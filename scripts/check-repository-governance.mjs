import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectFile = (relativePath) => path.join(projectRoot, relativePath);

const exists = async (relativePath) => {
  try {
    await access(projectFile(relativePath));
    return true;
  } catch {
    return false;
  }
};

const [packageJsonText, envExample, setup, gitignore, gitattributes, agents] = await Promise.all([
  readFile(projectFile('package.json'), 'utf8'),
  readFile(projectFile('.env.example'), 'utf8'),
  readFile(projectFile('SETUP.md'), 'utf8'),
  readFile(projectFile('.gitignore'), 'utf8'),
  readFile(projectFile('.gitattributes'), 'utf8'),
  readFile(projectFile('AGENTS.md'), 'utf8'),
]);

const packageJson = JSON.parse(packageJsonText);
assert.equal(packageJson.name, 'wincomehair-site', 'package.json must use the project-specific name');
assert.ok(packageJson.overrides?.rollup, 'npm rollup override must remain configured');
assert.ok(!packageJson.pnpm, 'package.json must not contain pnpm-only configuration');
assert.ok(!packageJson.resolutions, 'package.json must not contain Yarn-only resolutions');

assert.ok(await exists('package-lock.json'), 'package-lock.json is the required npm lockfile');
for (const alternativeLock of ['bun.lockb', 'bun.lock', 'pnpm-lock.yaml', 'yarn.lock']) {
  assert.equal(await exists(alternativeLock), false, `Unsupported lockfile present: ${alternativeLock}`);
}

for (const prohibitedFile of ['push_seo.py']) {
  assert.equal(await exists(prohibitedFile), false, `Prohibited direct-main helper present: ${prohibitedFile}`);
}

const envKeys = new Set(
  envExample
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => line.slice(0, line.indexOf('='))),
);

for (const key of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'NOTIFY_EMAIL', 'NOTIFY_FROM']) {
  assert.ok(envKeys.has(key), `.env.example is missing server variable: ${key}`);
}
assert.ok(!envKeys.has('VITE_SUPABASE_ANON_KEY'), 'Unused browser Supabase key must not be documented');

for (const requiredSetupText of [
  '541418372wl-glitch/wincomehair',
  'https://wincomehair.com',
  'npm ci',
  'npm run build',
  'npm test',
]) {
  assert.ok(setup.includes(requiredSetupText), `SETUP.md is missing: ${requiredSetupText}`);
}

assert.ok(gitignore.includes('.accio/'), '.gitignore must exclude local Accio runtime state');
assert.ok(gitignore.includes('.private/'), '.gitignore must exclude local private project data');
assert.ok(gitignore.includes('.env*'), '.gitignore must exclude environment files');
assert.ok(gitignore.includes('!.env.example'), '.gitignore must keep the safe environment template trackable');
assert.ok(gitattributes.includes('* text=auto eol=lf'), '.gitattributes must keep text line endings stable across devices');
assert.ok(agents.includes('541418372wl-glitch/wincomehair'), 'AGENTS.md must retain the unique repository mapping');
assert.ok(agents.includes('https://wincomehair.com'), 'AGENTS.md must retain the production domain mapping');

console.log('Repository governance checks passed: npm-only lockfile, server env template, project identity and prohibited helper rules verified');
