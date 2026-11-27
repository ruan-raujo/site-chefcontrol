import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const output = resolve('dist');
// Only replace this project's generated directory, even if invoked from another cwd.
if (output !== resolve(projectRoot, 'dist')) throw new Error('Execute o build na raiz do site.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Ship the modules the page uses, without the skill's demos and unused effects.
const entries = ['index.html', 'styles.css', 'app.js',
  'downloads/ChefControl-Setup-1.0.0-Windows-x64.exe.sha256',
  'assets/favicon.svg', 'assets/share.jpg', 'assets/fonts', 'assets/product',
  'assets/vendor/motion/motion.js', 'assets/vendor/motion/motion.css',
  'assets/vendor/moments/moments.js', 'assets/vendor/moments/lib.js',
  'assets/vendor/moments/liquid-type/moment.js', 'assets/vendor/moments/liquid-type/moment.css'];
for (const entry of entries) {
  await mkdir(resolve('dist', entry, '..'), { recursive: true });
  await cp(resolve(entry), resolve('dist', entry), { recursive: true });
}

const installer = 'downloads/ChefControl-Setup-1.0.0-Windows-x64.exe';
const hasInstaller = await stat(installer).then(info => info.isFile()).catch(error => {
  if (error.code === 'ENOENT') return false;
  throw error;
});
if (hasInstaller && process.env.VERCEL !== '1') {
  await cp(installer, resolve(output, installer));
  console.log('Site pronto em dist/, com instalador local para testes.');
} else {
  console.log('Site pronto em dist/. Na Vercel, o download é redirecionado para o GitHub Releases.');
}
