import { state, esc } from './state.js';
import { route, start, refresh } from './router.js';
import { renderNav } from './components/Nav.js';
import { renderCatalogue, dataFor } from './components/Catalogue.js';
import { renderDashboard } from './components/Management.js';
import { login, DEMO_MODE, DEPTS } from './api/client.js';

const $ = () => document.getElementById('app-root');
const go = (branch, hash) => { state.setBranch(branch); location.hash = hash };

function renderHome() {
  const P = (b, title, blurb, chips) => `<button class="prop ${state.activeBranch === b ? 'active' : ''}" data-b="${b}"><h3>${title}</h3><p class="muted">${blurb}</p>
    <span class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</span><b style="color:var(--accent-text)">Explore ${title.replace('Penuel ', '')}</b></button>`;
  $().innerHTML = `<div class="wrap"><section class="hero"><h1>Welcome to the Penuel Empire</h1>
    <p>Two properties in the Amboseli region, one team. Stay, dine, shop and service your car, then pay from your phone with M-Pesa.</p>
    <a class="btn" href="#/catalogue">Explore our services</a></section>
    <div class="props">${P('plaza', 'Penuel Plaza', 'A luxury hotel in the Amboseli region with Kilimanjaro views, safari experiences and fine dining.', ['Rooms', 'Experiences', 'Dining'])}
    ${P('stopover', 'Penuel Stopover', 'A 24/7 highway stop with an express shop, restaurant, car wash and service bay.', ['Retail', 'Restaurant', 'Auto services'])}</div></div>`;
  $().querySelectorAll('.prop').forEach(p => p.onclick = () => go(p.dataset.b, '#/catalogue'));
}

function renderAbout() {
  const b = state.activeBranch, d = dataFor(b), n = x => Array.isArray(x) ? x.length : 0, u = d.units || {};
  const staffTotal = Object.values(d.staffing || {}).reduce((a, x) => a + (+x || 0), 0);
  const view = b === 'plaza'
    ? { title: 'Penuel Plaza', text: `${d.theme} in the ${d.location}. Rooms with mountain views, guided safari experiences and on-site dining.`, stats: [[n(d.rooms), 'Room types'], [n(d.experiences), 'Experiences'], [n(d.facilities), 'Facilities']], chips: d.facilities }
    : { title: 'Penuel Stopover', text: `${d.type} on the ${d.location}. Open ${d.operating_hours}, with retail, a restaurant and automotive services in one stop.`, stats: [[d.operating_hours, 'Open'], [Object.keys(u).length, 'Service units'], [staffTotal, 'Team members']], chips: Object.values(u).map(x => x.name) };
  $().innerHTML = `<div class="wrap"><section class="hero"><h1>${esc(view.title)}</h1><p>${esc(view.text)}</p></section>
    <div class="about-grid">${view.stats.map(([v, l]) => `<div><b>${esc(v)}</b><span class="muted">${esc(l)}</span></div>`).join('')}</div>
    <span class="chips">${(view.chips || []).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</span>
    <p style="margin:32px 0"><a class="btn" href="#/catalogue">Browse ${esc(view.title)}</a></p></div>`;
}

function renderGate() {
  if (state.userRole !== 'public') { location.hash = '#/dashboard'; return }
  $().innerHTML = `<div class="wrap"><form class="gate" id="gf"><h2>Staff gate</h2><p class="muted">Sign in to see orders and reports.</p>
    <div class="field"><label for="em">Email</label><input id="em" type="email" autocomplete="username" required></div>
    <div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required></div>
    <div id="gm" class="msg err" aria-live="polite"></div><div class="row"><button class="btn" id="gb">Sign in</button></div>
    ${DEMO_MODE ? `<p class="muted msg">Demo accounts (replace before launch): owner@penuel.com / owner123, or ${DEPTS[0]}@penuel.com / ${DEPTS[0]}123 for a department.</p>` : ''}</form></div>`;
  document.getElementById('gf').onsubmit = async e => {
    e.preventDefault(); const gb = document.getElementById('gb'); gb.disabled = true;
    const r = await login(document.getElementById('em').value, document.getElementById('pw').value);
    if (r?.ok) { state.setAuth(r.role, r.dept); location.hash = '#/dashboard' }
    else { document.getElementById('gm').textContent = r?.message || 'Sign-in failed.'; gb.disabled = false }
  };
}

route('/', renderHome); route('/about', renderAbout); route('/catalogue', renderCatalogue);
route('/gate', renderGate); route('/dashboard', renderDashboard);

const rerender = () => { renderNav(); refresh() };
['aura-sync', 'auth-changed', 'data-changed'].forEach(e => addEventListener(e, rerender));
addEventListener('hashchange', renderNav);
document.documentElement.setAttribute('data-theme', state.activeBranch);
renderNav();
start();
