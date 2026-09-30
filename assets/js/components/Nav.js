import { state, BRAND } from '../state.js';
import { current } from '../router.js';

const BR = ['empire', 'plaza', 'stopover'];
export function renderNav() {
  const root = document.getElementById('nav-root'), c = current(), b = state.activeBranch;
  if (c === '/gate' || c === '/dashboard') { root.innerHTML = ''; return }
  const authed = state.userRole !== 'public';
  const links = [['/', 'Home'], ['/about', 'About'], ['/catalogue', 'Services'], ...(authed ? [['/dashboard', 'Dashboard']] : [])];
  const on = p => (c === p || (p === '/catalogue' && c.startsWith('/item'))) ? 1 : 0;
  root.innerHTML = `<header class="navbar navbar--${b}"><div class="navbar__inner">
    <a class="navbar__brand" href="#/"><span class="navbar__brand-icon">${BRAND[b].icon}</span><span class="navbar__brand-text">Penuel <em>${BRAND[b].name}</em></span></a>
    <nav class="navbar__links">${links.map(([p, t]) => `<a class="navbar__link ${on(p) ? 'navbar__link--active' : ''}" href="#${p}">${t}</a>`).join('')}
      ${authed ? '<a class="navbar__cta" href="#/" id="so">Sign out</a>' : '<a class="navbar__cta" href="#/gate">Staff gate</a>'}</nav>
    <button class="navbar__burger" id="bg" aria-label="Menu" aria-expanded="false">☰</button></div>
    <div class="mobile-menu" id="mm"><nav class="mobile-menu__nav">${links.map(([p, t]) => `<a class="mobile-menu__link ${on(p) ? 'mobile-menu__link--active' : ''}" href="#${p}">${t}<span class="mobile-menu__chevron">›</span></a>`).join('')}
      ${authed ? '<a class="mobile-menu__cta" href="#/" id="so2">Sign out</a>' : '<a class="mobile-menu__cta" href="#/gate">Staff gate</a>'}</nav>
      <div class="mobile-menu__switcher">${BR.map(x => `<button class="mob-sw-btn mob-sw-btn--${x} ${b === x ? 'is-active' : ''}" data-aura="${x}">${BRAND[x].icon} ${BRAND[x].name}</button>`).join('')}</div></div></header>
    <div class="floater floater--visible">${BR.map(x => `<button class="floater__btn floater__btn--${x} ${b === x ? 'is-active' : ''}" data-aura="${x}" title="${BRAND[x].name}"><span>${BRAND[x].icon}</span><span class="floater__label">${BRAND[x].name}</span></button>`).join('')}</div>`;
  const out = () => state.setAuth('public', 'all');
  document.getElementById('so')?.addEventListener('click', out); document.getElementById('so2')?.addEventListener('click', out);
  document.getElementById('bg').onclick = e => { const o = document.getElementById('mm').classList.toggle('mobile-menu--open'); e.currentTarget.setAttribute('aria-expanded', o); e.currentTarget.textContent = o ? '✕' : '☰' };
}
