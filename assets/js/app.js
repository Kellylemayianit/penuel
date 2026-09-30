import { state, esc } from './state.js';
import { route, start, refresh } from './router.js';
import { renderNav } from './components/Nav.js';
import { renderCatalogue, dataFor } from './components/Catalogue.js';
import { renderManagement } from './components/Management.js';

function renderHome() {
  const d = dataFor(state.activeBranch);
  document.getElementById('app-root').innerHTML = `<div class="wrap"><section class="hero"><h1>${esc(d.name)}</h1><p>${esc(d.tagline)}. Pick what you need and pay with M-Pesa from your phone.</p>
    <a class="btn" href="#/catalogue">Browse ${state.activeBranch === 'plaza' ? 'rooms and dining' : 'services and shop'}</a></section></div>`;
}

route('/', renderHome);
route('/catalogue', renderCatalogue);
route('/management', renderManagement);

const rerender = () => { renderNav(); refresh() };
['aura-sync', 'auth-changed', 'data-changed'].forEach(e => addEventListener(e, rerender));
addEventListener('hashchange', renderNav);

document.documentElement.setAttribute('data-theme', state.activeBranch);
renderNav();
start();
