import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const filename = 'ChefControl-Setup-1.0.0-Windows-x64.exe';

async function fixture(run) {
  const parent = resolve(tmpdir());
  const directory = await mkdtemp(resolve(parent, 'chefcontrol-build-'));
  try {
    await mkdir(resolve(directory, 'scripts'));
    await mkdir(resolve(directory, 'downloads'));
    for (const name of ['package.json', 'vercel.json', 'index.html', 'styles.css', 'app.js', 'assets', 'scripts/build.mjs', `downloads/${filename}.sha256`]) {
      await cp(resolve(root, name), resolve(directory, name), { recursive: true });
    }
    await run(directory);
  } finally {
    if (!directory.startsWith(parent + sep) || !directory.split(sep).at(-1).startsWith('chefcontrol-build-')) {
      throw new Error('Pasta temporária fora do destino esperado.');
    }
    await rm(directory, { recursive: true, force: true });
  }
}

function build(directory, vercel = false) {
  const env = { ...process.env };
  if (vercel) env.VERCEL = '1'; else delete env.VERCEL;
  return execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: directory, env, encoding: 'utf8' });
}

test('clean Git checkout builds without an installer and retains the download redirect', async () => {
  await fixture(async directory => {
    build(directory, true);
    assert.ok((await stat(resolve(directory, 'dist/index.html'))).isFile());
    assert.ok((await stat(resolve(directory, `dist/downloads/${filename}.sha256`))).isFile());
    await assert.rejects(stat(resolve(directory, `dist/downloads/${filename}`)), { code: 'ENOENT' });
    const html = await readFile(resolve(directory, 'dist/index.html'), 'utf8');
    const config = JSON.parse(await readFile(resolve(directory, 'vercel.json'), 'utf8'));
    const redirect = config.redirects.find(item => item.source === `/downloads/${filename}`);
    assert.ok(html.includes(`href="downloads/${filename}"`));
    assert.equal(redirect.destination, `https://github.com/ruan-raujo/site-chefcontrol/releases/download/chefcontrol-v1.0.0/${filename}`);
  });
});

test('Vercel build excludes local and stale installers; local builds still include them', async () => {
  await fixture(async directory => {
    await writeFile(resolve(directory, 'downloads', filename), 'MZ-test-fixture');
    build(directory);
    assert.equal(await readFile(resolve(directory, 'dist/downloads', filename), 'utf8'), 'MZ-test-fixture');
    build(directory, true);
    await assert.rejects(stat(resolve(directory, 'dist/downloads', filename)), { code: 'ENOENT' });
  });
});
