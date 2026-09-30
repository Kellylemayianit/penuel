import { state } from '../state.js';
import { current } from '../router.js';

export function renderNav() {
  const b = state.activeBranch, other = b === 'plaza' ? 'stopover' : 'plaza', c = current();
  const on = p => c === p ? 'on' : '', authed = state.userRole !== 'public';
  const name = x => x === 'plaza' ? 'Plaza' : 'Stopover';
  document.getElementById('nav-root').innerHTML = `<nav class="nav" id="nv" aria-label="Main">
    <a class="brand" href="#/">Penuel <span>${name(b)}</span></a>
    <div class="links"><a class="link ${on('/')}" href="#/">Home</a><a class="link ${on('/about')}" href="#/about">About</a>
      <a class="link ${on('/catalogue')}" href="#/catalogue">Catalogue</a>${authed ? `<a class="link ${on('/dashboard')}" href="#/dashboard">Dashboard</a>` : ''}
      <button class="btn ghost" id="bt">Switch to ${name(other)}</button>
      ${authed ? '<button class="btn" id="ab">Sign out</button>' : '<a class="btn" href="#/gate">Staff gate</a>'}</div>
    <button class="menu" id="mb" aria-label="Menu" aria-expanded="false">☰</button></nav>`;
  document.getElementById('bt').onclick = () => state.setBranch(other);
  const ab = document.getElementById('ab');
  if (ab) ab.onclick = () => { state.setAuth('public', 'all'); location.hash = '#/' };
  document.getElementById('mb').onclick = e => { const o = document.getElementById('nv').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); e.currentTarget.textContent = o ? '✕' : '☰' };
}
