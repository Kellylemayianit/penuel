import { state } from '../state.js';
import { current } from '../router.js';
import { openLogin } from './Modal.js';

export function renderNav() {
  const b = state.activeBranch, other = b === 'plaza' ? 'stopover' : 'plaza';
  const c = current(), on = p => c === p ? 'on' : '';
  const authed = state.userRole !== 'public';
  document.getElementById('nav-root').innerHTML = `<nav class="nav" aria-label="Main">
    <a class="brand" href="#/">Penuel ${b === 'plaza' ? 'Plaza' : 'Stopover'}</a>
    <a class="link ${on('/')}" href="#/">Home</a>
    <a class="link ${on('/catalogue')}" href="#/catalogue">Catalogue</a>
    <a class="link ${on('/management')}" href="#/management">Management</a>
    <button class="btn ghost" id="branch-toggle">Go to ${other === 'plaza' ? 'Plaza' : 'Stopover'}</button>
    <button class="btn" id="auth-btn">${authed ? 'Sign out' : 'Staff login'}</button></nav>`;
  document.getElementById('branch-toggle').onclick = () => state.setBranch(other);
  document.getElementById('auth-btn').onclick = () => authed ? state.setAuth('public', 'all') : openLogin();
}
