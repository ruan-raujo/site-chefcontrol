const root = document.documentElement;
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') root.dataset.input = 'keyboard';
});
document.addEventListener('pointerdown', () => { root.dataset.input = 'pointer'; }, { passive: true });

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav__links');
const mobileQuery = matchMedia('(max-width: 1023px)');
menuButton.hidden = false;
function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.dataset.open = String(open);
  if (mobileQuery.matches) {
    navigation.inert = !open;
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  const wasMobileOpen = mobileQuery.matches && menuButton.getAttribute('aria-expanded') === 'true';
  setMenu(false);
  if (wasMobileOpen) {
    const target = document.querySelector(link.hash);
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  if (event.key === 'Tab' && mobileQuery.matches && menuButton.getAttribute('aria-expanded') === 'true') {
    const focusable = [...document.querySelectorAll('.nav__logo, .nav__links a, .menu-toggle')].filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
function syncNavigation() {
  setMenu(false);
  navigation.inert = mobileQuery.matches;
  document.querySelector('main').inert = false;
  document.querySelector('footer').inert = false;
  document.body.style.overflow = '';
}
mobileQuery.addEventListener('change', syncNavigation);
syncNavigation();

const tabs = [...document.querySelectorAll('[data-tab]')];
const descriptions = {
  dashboard: 'O que precisa da sua atenção, à primeira vista.',
  orders: 'Acompanhe cada encomenda, da bancada à entrega.',
  recipes: 'Ingredientes, custo e preço de venda em cada receita.',
  inventory: 'Veja o que tem na despensa e o que precisa repor.',
};
document.querySelector('.tour__tabs').hidden = false;
function selectTab(tab, keyboard = false) {
  const name = tab.dataset.tab;
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls'));
    panel.hidden = !selected;
    // All screenshot pixels are loaded before a tab can be selected; swaps never animate numbers.
    if (selected && !keyboard && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.animate([{ opacity: 0.65 }, { opacity: 1 }], { duration: 160, easing: 'cubic-bezier(0.23,1,0.32,1)' });
    }
  });
  document.getElementById('tour-description').textContent = descriptions[name];
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => selectTab(tab, event.detail === 0));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectTab(tabs[next], true); }
  });
});
// Only preload tour screenshots when the product section is close to the viewport.
const tourObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  document.querySelectorAll('.tour-panel img').forEach(img => { img.loading = 'eager'; });
  tourObserver.disconnect();
}, { rootMargin: '400px' });
tourObserver.observe(document.getElementById('produto'));

const portion = document.getElementById('portion');
const markup = document.getElementById('markup');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
function updateCalculator(announce = false) {
  const grams = Number(portion.value), gain = Number(markup.value);
  // Whole-cent package price × whole grams; round only after the full proportional calculation.
  const costCents = Math.floor((1000 * grams + 50) / 100);
  const priceCents = Math.floor((1000 * grams * (100 + gain) + 5000) / 10000);
  document.getElementById('portion-value').textContent = `${grams} g`;
  document.getElementById('ingredient-cost').textContent = currency.format(costCents / 100);
  document.getElementById('suggested-price').textContent = currency.format(priceCents / 100);
  portion.setAttribute('aria-valuetext', `${grams} gramas`);
  if (announce) document.getElementById('calculation-status').textContent = `${grams} gramas custam ${currency.format(costCents / 100)}. Com ganho de ${gain}%, o preço sugerido é ${currency.format(priceCents / 100)}.`;
}
portion.addEventListener('input', () => updateCalculator());
portion.addEventListener('change', () => updateCalculator(true));
markup.addEventListener('change', () => updateCalculator(true));
updateCalculator();
