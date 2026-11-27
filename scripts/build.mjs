import { cp, mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
try { await stat('downloads/ChefControl-Setup-1.0.0-Windows-x64.exe'); } catch { throw new Error('O instalador está ausente. Consulte o README para preparar o download.'); }
await mkdir('dist', { recursive: true });
// Ship the modules the page uses, without the skill's demos and unused effects.
const entries = ['index.html', 'styles.css', 'app.js', 'downloads',
  'assets/favicon.svg', 'assets/share.jpg', 'assets/fonts', 'assets/product',
  'assets/vendor/motion/motion.js', 'assets/vendor/motion/motion.css',
  'assets/vendor/moments/moments.js', 'assets/vendor/moments/lib.js',
  'assets/vendor/moments/liquid-type/moment.js', 'assets/vendor/moments/liquid-type/moment.css'];
for (const entry of entries) {
  await mkdir(resolve('dist', entry, '..'), { recursive: true });
  await cp(resolve(entry), resolve('dist', entry), { recursive: true });
}
console.log('Site pronto em dist/, incluindo o instalador Windows.');
