import { state, esc, BRAND } from './state.js';
import { route, start, refresh } from './router.js';
import { renderNav } from './components/Nav.js';
import { renderCatalogue, normalise, dataFor } from './components/Catalogue.js';
import { renderItem } from './components/ProductDetail.js';
import { renderDashboard } from './components/Management.js';
import { login, DEMO_MODE, DEPTS } from './api/client.js';

const $ = () => document.getElementById('app-root'), BR = ['empire', 'plaza', 'stopover'];
const cnt = x => normalise(x).flatMap(t => t.items).length;

const HERO = {
  empire: ['Welcome to the Penuel Empire', 'A luxury hotel and a 24/7 highway stop in the Amboseli region, run as one team.'],
  plaza: ['Penuel Plaza', 'A luxury hotel in the Amboseli region with Kilimanjaro views, safari experiences and fine dining.'],
  stopover: ['Penuel Stopover', 'Fuel up, eat, shop and service your car at one stop, open around the clock.'] };

function renderHome() {
  const b = state.activeBranch, [t, sub] = HERO[b];
  const prop = (x, cls, blurb, feats) => `<div class="property-card ${cls}" data-aura="${x}" data-go="#/catalogue"><div class="card-icon">${BRAND[x].icon}</div><h3>Penuel ${BRAND[x].name}</h3><p>${blurb}</p>
    <div class="card-features">${feats.map(f => `<span>${f}</span>`).join('')}</div><button class="card-cta">Explore ${BRAND[x].name} →</button></div>`;
  $().innerHTML = `<div class="home"><section class="hero-section"><div class="hero-content"><div class="hero-badge">${BRAND[b].icon} Amboseli, Kenya</div><h1 class="hero-title">${t}</h1><p class="hero-subtitle">${sub}</p>
    <button class="hero-cta" data-go="#/catalogue">Explore our services →</button></div><div class="hero-gradient"></div></section>
    <section class="aura-selector"><span class="aura-selector-label">Choose your experience</span><div class="aura-selector-buttons">${BR.map(x => `<button class="aura-btn ${x} ${b === x ? 'active' : ''}" data-aura="${x}"><span class="aura-btn-icon">${BRAND[x].icon}</span>${BRAND[x].name}</button>`).join('')}</div></section>
    <section class="legacy-section"><div class="legacy-container"><h2>Two properties, one team</h2><p class="legacy-text">Penuel Plaza is a hotel in the Amboseli region. Penuel Stopover is a highway stop with an express shop, a restaurant, a car wash and a service bay. Book, order and pay from your phone.</p></div></section>
    <section class="properties-section"><div class="properties-container"><h2 class="properties-title">Discover our properties</h2><div class="properties-grid">
    ${prop('plaza', 'plaza-card', 'Rooms with mountain views, guided safari experiences and on-site dining.', ['Rooms', 'Experiences', 'Dining'])}
    ${prop('stopover', 'stopover-card', 'Retail, dining and auto services on the move, open 24/7.', ['Retail', 'Restaurant', 'Auto services'])}</div>
    <div class="empire-stats"><div class="empire-stat"><div class="empire-stat-number">2</div><div class="empire-stat-label">Properties</div></div><div class="empire-stat"><div class="empire-stat-number">${cnt('plaza')}</div><div class="empire-stat-label">Plaza services</div></div><div class="empire-stat"><div class="empire-stat-number">${cnt('stopover')}</div><div class="empire-stat-label">Stopover services</div></div></div></div></section>
    <section class="footer-cta"><h2>Ready when you are</h2><p>Choose a service and pay with M-Pesa.</p><button class="footer-cta-btn" data-go="#/catalogue">Browse services</button></section></div>`;
}

function renderAbout() {
  const b = state.activeBranch, n = x => Array.isArray(x) ? x.length : 0;
  const P = dataFor('plaza'), S = dataFor('stopover'), staff = Object.values(S.staffing || {}).reduce((a, x) => a + (+x || 0), 0);
  const V = { empire: { h: 'The Penuel Empire', p: 'Two properties in the Amboseli region, managed from one place.', stats: [['🏛️', 2, 'Properties', 'Plaza and Stopover'], ['⏱️', S.operating_hours, 'Stopover hours', 'Always open'], ['🛏️', n(P.rooms), 'Room types', 'At Penuel Plaza']], story: 'Penuel Plaza welcomes guests to a luxury hotel with safari experiences. Penuel Stopover keeps travellers moving with retail, dining and auto services. One team and one portal serve both.', chips: ['Hotel', 'Safari', 'Retail', 'Dining', 'Auto services'] },
    plaza: { h: 'Penuel Plaza', p: `${P.theme} in the ${P.location}.`, stats: [['🛏️', n(P.rooms), 'Room types', 'Sleeps 2 to 4'], ['🦁', n(P.experiences), 'Experiences', 'Guided by our team'], ['🏊', n(P.facilities), 'Facilities', 'On site']], story: 'Rooms with Kilimanjaro views, guided safari experiences and dining at Savanna Kitchen, all in the Amboseli region.', chips: P.facilities || [] },
    stopover: { h: 'Penuel Stopover', p: `${S.type} on the ${S.location}.`, stats: [['⏱️', S.operating_hours, 'Open', 'Every day'], ['🏬', Object.keys(S.units || {}).length, 'Service units', 'Shop, restaurant, auto'], ['👥', staff, 'Team members', 'Across all units']], story: 'An express shop, a restaurant, a car wash and a service bay in one stop, so travellers can rest, eat and get back on the road.', chips: Object.values(S.units || {}).map(x => x.name) } }[b];
  $().innerHTML = `<div class="about"><section class="about-hero"><div class="about-hero-content"><h1>${esc(V.h)}</h1><p>${esc(V.p)}</p></div></section>
    <section class="about-switcher-section"><div class="about-switcher"><span class="switcher-label">Explore</span><div class="switcher-buttons">${BR.map(x => `<button class="switcher-btn switcher-btn--${x} ${b === x ? 'active' : ''}" data-aura="${x}"><span class="switcher-btn-icon">${BRAND[x].icon}</span>${BRAND[x].name}</button>`).join('')}</div></div></section>
    <section class="trust-bar"><div class="container"><div class="trust-stats-grid">${V.stats.map(([i, v, l, d]) => `<div class="trust-stat"><div class="stat-icon">${i}</div><div class="stat-number">${esc(v)}</div><div class="stat-label">${l}</div><div class="stat-description">${d}</div></div>`).join('')}</div></div></section>
    <section class="brand-story"><div class="container"><div class="story-grid"><div class="story-text"><h2>${esc(V.h)}</h2><p>${esc(V.story)}</p><div class="story-highlights">${V.chips.map(c => `<span class="highlight-badge">${esc(c)}</span>`).join('')}</div></div></div></div></section>
    <section class="about-cta"><div class="cta-content"><h2>See what we offer</h2><a class="cta-button" href="#/catalogue">Browse services</a></div></section></div>`;
}

function renderGate() {
  if (state.userRole !== 'public') { location.hash = '#/dashboard'; return }
  $().innerHTML = `<div class="login-container"><div class="login-background-glow"></div><div class="login-vault"><div class="login-branding"><h1>PENUEL</h1><p>Empire Gateway</p></div>
    <div class="login-card"><div class="login-header"><div class="login-icon">🛡️</div><h2>Access the portal</h2><p class="login-subtitle">Sign in for staff and owners</p></div>
    <form class="login-form" id="gf"><div class="form-group"><label for="em">Email address</label><div class="input-wrapper"><input id="em" type="email" placeholder="you@penuel.com" autocomplete="username" required></div></div>
    <div class="form-group"><label for="pw">Password</label><div class="input-wrapper"><input id="pw" type="password" placeholder="••••••••" autocomplete="current-password" required></div></div>
    <div class="error-message" id="gm" hidden></div><button class="login-button" id="gb">Sign in</button></form>
    <div class="login-footer">${DEMO_MODE ? `<p class="demo-note">Demo accounts, replace before launch: <code>owner@penuel.com</code> <code>owner123</code> or <code>${DEPTS[0]}@penuel.com</code> <code>${DEPTS[0]}123</code></p>` : ''}<p class="demo-note"><a href="#/">← Back to the public site</a></p></div></div></div></div>`;
  document.getElementById('gf').onsubmit = async e => {
    e.preventDefault(); const gb = document.getElementById('gb'), gm = document.getElementById('gm'); gb.disabled = true; gm.hidden = true;
    const r = await login(document.getElementById('em').value, document.getElementById('pw').value);
    if (r?.ok) { state.setAuth(r.role, r.dept); location.hash = '#/dashboard' } else { gm.textContent = r?.message || 'Sign-in failed.'; gm.hidden = false; gb.disabled = false }
  };
}

route('/', renderHome); route('/about', renderAbout); route('/catalogue', renderCatalogue); route('/item', renderItem); route('/gate', renderGate); route('/dashboard', renderDashboard);

// One delegated click handler for branch switching and in-page links
document.addEventListener('click', e => {
  const a = e.target.closest('[data-aura]'); if (a) state.setBranch(a.dataset.aura);
  const g = e.target.closest('[data-go]'); if (g) location.hash = g.dataset.go.slice(1);
});
const rerender = () => { renderNav(); refresh() };
['aura-sync', 'auth-changed', 'data-changed'].forEach(e => addEventListener(e, rerender));
addEventListener('hashchange', renderNav);
document.body.className = 'theme-' + state.activeBranch;
renderNav(); start();
