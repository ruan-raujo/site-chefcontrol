import { chromium } from '../../ChefControl/chef-control-front/node_modules/playwright-core/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const output = new URL('../qa/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { sizes: [], errors: [], interactions: [] };
try {
  for (const [width, height] of [[1440,900],[1024,768],[820,1180],[768,1024],[390,844],[320,812]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 640, hasTouch: width < 640 });
    page.on('pageerror', e => results.errors.push(e.message));
    page.on('response', response => { if (response.status() >= 400) results.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    results.sizes.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, fonts: document.fonts.check('500 40px Gabarito') && document.fonts.check('400 16px Figtree'), sections: [...document.querySelectorAll('main>section,footer')].map(el => { const b = el.getBoundingClientRect(); return { id: el.id || 'hero', y: b.y + scrollY, height: b.height, bottom: b.bottom + scrollY }; }), heroMedia: (() => { const r = document.querySelector('.hero-visual').getBoundingClientRect(); return { top:r.top, bottom:r.bottom }; })() })));
    assert.ok(results.sizes.at(-1).scrollWidth <= width, `Horizontal overflow at ${width}`);
    const headlineLines = await page.locator('h1').evaluate(el => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
    assert.ok(headlineLines <= 3.1, `Hero heading exceeds three lines at ${width}`);
    if (width === 390) {
      const edge = await page.locator('#cost-heading').evaluate(el => el.getBoundingClientRect().left);
      assert.equal(edge, 24, 'Cost section aligns to the mobile gutter');
      for (const selector of ['.brand', '.hero .btn--secondary', '#portion']) {
        assert.ok(await page.locator(selector).evaluate(el => el.getBoundingClientRect().height >= 44), `Touch target too small: ${selector}`);
      }
      results.interactions.push('Mobile logo, secondary action and slider have touch targets of at least 44px');
    }
    await page.screenshot({ path: fileURLToPath(new URL(`hero-${width}.png`, output)) });
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: fileURLToPath(new URL(`full-${width}.png`, output)), fullPage: true });
      if (width === 1440) await page.screenshot({ path: fileURLToPath(new URL('../assets/share.jpg', import.meta.url)), type:'jpeg', quality:85 });
    }
    if (width === 1440) {
      for (const name of ['orders','recipes','inventory','dashboard']) {
        await page.locator(`[data-tab=${name}]`).click();
        assert.equal(await page.locator(`#panel-${name}`).isVisible(), true);
      }
      await page.locator('[data-tab=dashboard]').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#tab-orders').getAttribute('aria-selected'), 'true');
      await page.locator('#portion').fill('100');
      assert.match(await page.locator('#ingredient-cost').innerText(), /10,00/);
      assert.match(await page.locator('#suggested-price').innerText(), /25,00/);
      await page.locator('#markup').selectOption('0');
      assert.match(await page.locator('#suggested-price').innerText(), /10,00/);
      await page.locator('#portion').fill('30');
      await page.locator('#markup').selectOption('150');
      assert.match(await page.locator('#suggested-price').innerText(), /7,50/);
      results.interactions.push('Four screenshot tabs, arrow-key tab navigation, proportional costs and gain passed');
      const response = await page.request.head('http://127.0.0.1:4173/downloads/ChefControl-Setup-1.0.0-Windows-x64.exe');
      assert.equal(response.status(), 200);
      assert.equal(response.headers()['content-length'], '317683829');
      const range = await page.request.get('http://127.0.0.1:4173/downloads/ChefControl-Setup-1.0.0-Windows-x64.exe', { headers: { Range:'bytes=0-1' } });
      assert.equal(range.status(),206);
      assert.equal((await range.body()).toString(),'MZ');
      results.interactions.push('Installer exists, correct byte size, HTTP range download, Windows executable signature passed');
    }
    if (width === 390) {
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('main').evaluate(el => el.inert),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('main').evaluate(el => el.inert),false);
      await page.locator('.menu-toggle').click();
      await page.getByRole('navigation',{name:'Navegação do site'}).getByRole('link',{name:'Precificação'}).click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      await page.locator('details summary').click();
      assert.equal(await page.locator('details').getAttribute('open'),'');
      results.interactions.push('Mobile menu open/close, Escape, anchor navigation, installation details passed');
    }
    await page.close();
  }
  const reduced = await browser.newPage({ viewport:{width:390,height:844}, reducedMotion:'reduce' });
  await reduced.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  assert.equal(await reduced.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');
  results.interactions.push('Reduced-motion hero remains visible');
  const noJs = await browser.newPage({ viewport: {width:390,height:844}, javaScriptEnabled:false });
  await noJs.goto('http://127.0.0.1:4173/');
  assert.equal(await noJs.locator('h1').isVisible(),true);
  assert.equal(await noJs.locator('.hero .btn--primary').isVisible(),true);
  assert.equal(await noJs.locator('.nav__links').isVisible(),false);
  results.interactions.push('Without JavaScript, content and download remain accessible on mobile');
  assert.deepEqual(results.errors, []);
} finally {
  await writeFile(new URL('checks.json',output),JSON.stringify(results,null,2));
  await browser.close();
}
console.log(JSON.stringify(results,null,2));
