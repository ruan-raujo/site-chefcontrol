import { chromium } from '../../ChefControl/chef-control-front/node_modules/playwright-core/index.mjs';
import { initialInsumos, initialProdutos, initialPedidos } from '../../ChefControl/chef-control-front/src/utils/mockData.js';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
await mkdir(new URL('../assets/product/', import.meta.url), { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1 });
  const catalog = {
    insumos: initialInsumos,
    produtos: initialProdutos.map(p => ({ ...p, imagem: '', ingredientes: [{ insumoId: 1, quantidade: 1 }] })),
    pedidos: initialPedidos.map((p, i) => ({ ...p, cliente: ['Cliente da confeitaria', 'Encomenda de aniversário', 'Pedido do fim de semana', 'Encomenda entregue'][i], dataEntrega: `2026-11-${27 + i}` })),
    entradas: [],
  };
  await page.route('**/api/**', route => route.fulfill({ json: catalog }));
  await page.addInitScript(() => localStorage.setItem('chefcontrol-profile', JSON.stringify({
    version: 1, name: 'Confeiteira', displayName: 'Confeiteira', business: 'Minha confeitaria',
    role: 'Head Confeiteiro & Proprietário', stock: true, oven: true, summary: true, markupPercent: 150,
  })));
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => document.fonts.ready);
  const shot = name => page.screenshot({ path: fileURLToPath(new URL(`../assets/product/${name}.png`, import.meta.url)) });
  await shot('dashboard');
  for (const [label, name] of [['Pedidos', 'orders'], ['Produtos', 'recipes'], ['Insumos', 'inventory']]) {
    await page.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('button', { name: new RegExp(label) }).click();
    await page.waitForTimeout(350);
    await shot(name);
  }
  await page.setViewportSize({ width: 390, height: 740 });
  await page.reload({ waitUntil: 'networkidle' });
  await shot('mobile');
} finally { await browser.close(); }
