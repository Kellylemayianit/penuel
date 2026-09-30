import { state, esc, money } from '../state.js';
import { normalise, ICON } from './Catalogue.js';

const NEXT = { new: ['accepted', 'Accept'], accepted: ['done', 'Mark fulfilled'] };
const fmt = ts => new Date(ts).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' });
let view = null;

const row = o => { const n = NEXT[o.status];
  return `<div class="dash-row"><div class="grow"><b>${esc(o.item)}</b><span class="pill">${esc(o.status)}</span><br><small>${esc(o.id)} · ${esc(o.branch)} · ${esc(o.dept)} · ${fmt(o.ts)}${o.note ? ' · ' + esc(o.note) : ''}</small></div>
  <b>${money(o.price)}</b>${n ? `<button class="btn-lite" data-act="${n[0]}" data-id="${esc(o.id)}">${n[1]}</button>` : ''}</div>`; };
const card = (title, inner) => `<div class="dashboard-card" style="margin-bottom:1.5rem"><h3 class="performance-title">${title}</h3>${inner}</div>`;
const pulse = (icon, label, value) => `<div class="pulse-card"><div class="pulse-card-icon">${icon}</div><div class="pulse-card-content"><p class="pulse-card-label">${label}</p><p class="pulse-card-value">${value}</p></div></div>`;

export function renderDashboard() {
  if (state.userRole === 'public') { location.hash = '#/gate'; return }
  const ceo = state.userRole === 'ceo', d = state.userDept, oos = state.outOfStock();
  const tabs = ceo ? [['overview', '📊', 'Overview'], ['orders', '🧾', 'Orders'], ['activity', '🕘', 'Staff activity']] : [['orders', '🧾', 'Orders'], ['stock', '📦', 'Stock']];
  if (!tabs.some(t => t[0] === view)) view = tabs[0][0];
  const all = state.orders(), mine = all.filter(o => ceo || o.dept === d);
  const sum = f => all.filter(f).reduce((a, o) => a + o.price, 0);
  const byDept = Object.entries(all.reduce((m, o) => (m[o.dept] = (m[o.dept] || 0) + o.price, m), {}));
  const max = Math.max(1, ...byDept.map(x => x[1]));
  const activity = `<div class="activity-feed"><h3 class="activity-feed-title">Recent activity</h3><div class="activity-list">${state.log().slice(0, 30).map(l => `<div class="activity-item"><div class="activity-icon">•</div><div class="activity-content"><p class="activity-message">${esc(l.text)}</p><p class="activity-timestamp">${fmt(l.ts)} · ${esc(l.by)}</p></div></div>`).join('') || '<p class="muted" style="color:var(--text-muted)">No activity yet.</p>'}</div></div>`;
  const items = normalise('empire').flatMap(t => t.items).filter(i => i.dept === d);
  const open = mine.filter(o => o.status !== 'done'), done = mine.filter(o => o.status === 'done');
  const views = {
    overview: `<div class="metrics-grid">${pulse('💰', 'Total revenue', money(sum(() => true)))}${pulse('🏛️', 'Penuel Plaza', money(sum(o => o.branch === 'plaza')))}${pulse('⛽', 'Penuel Stopover', money(sum(o => o.branch === 'stopover')))}${pulse('⏳', 'Open orders', all.filter(o => o.status !== 'done').length)}</div>
      <div class="dashboard-content-split"><div class="performance-section"><div class="performance-overview"><h3 class="performance-title">Revenue by department</h3>${byDept.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><i style="width:${Math.max(4, v / max * 100)}%"></i><b>${money(v)}</b></div>`).join('') || '<p style="color:var(--text-muted)">No revenue yet.</p>'}</div></div><div class="activity-section">${activity}</div></div>`,
    orders: card(`Open orders (${open.length})`, open.map(row).join('') || '<p style="color:var(--text-muted)">No open orders. New payments appear here.</p>') + card(`Fulfilled (${done.length})`, done.slice(0, 10).map(row).join('') || '<p style="color:var(--text-muted)">Nothing fulfilled yet.</p>'),
    stock: card('Stock', items.map(i => `<div class="dash-row"><span class="grow">${ICON[i.dept]} ${esc(i.name)} <small>(${esc(i.brand)})</small></span><button class="btn-lite ghost" data-stock="${esc(i.id)}">${oos.includes(i.id) ? 'Back in stock' : 'Mark out of stock'}</button></div>`).join('') || '<p style="color:var(--text-muted)">No items for this department.</p>'),
    activity: `<div class="dashboard-card">${activity}</div>`
  };
  const title = tabs.find(t => t[0] === view)[2];
  document.getElementById('app-root').innerHTML = `<div class="dashboard-container"><header class="dashboard-header"><div class="header-left"><div class="header-breadcrumb"><span class="breadcrumb-root">Penuel</span><span class="breadcrumb-separator">/</span><span class="breadcrumb-current">${esc(title)}</span></div></div>
    <div class="header-right"><div class="system-heartbeat"><span class="heartbeat-dot"></span><span class="heartbeat-label">Live</span></div></div></header>
    <div class="dashboard-layout"><aside class="sidebar"><div class="sidebar-header"><div class="sidebar-branding">PENUEL</div><div class="sidebar-role-badge"><span class="role-label">${ceo ? 'Owner' : esc(d)}</span></div></div>
    <nav class="sidebar-menu">${tabs.map(t => `<button class="sidebar-menu-item ${view === t[0] ? 'active' : ''}" data-view="${t[0]}"><span class="menu-icon">${t[1]}</span><span class="menu-label">${t[2]}</span></button>`).join('')}</nav>
    <button class="sidebar-logout" id="lo">Sign out</button><div class="sidebar-footer"><a href="#/" style="color:inherit">← Public site</a></div></aside>
    <main class="dashboard-main"><div class="dashboard-page-header"><div class="dashboard-page-title"><h1>${esc(title)}</h1></div></div><div class="dashboard-content"><div style="grid-column:1/-1;min-width:0">${views[view]}</div></div></main></div></div>`;
  const root = document.getElementById('app-root');
  root.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { view = b.dataset.view; renderDashboard() });
  root.querySelectorAll('[data-act]').forEach(b => b.onclick = () => state.setStatus(b.dataset.id, b.dataset.act));
  root.querySelectorAll('[data-stock]').forEach(b => b.onclick = () => state.toggleStock(b.dataset.stock));
  document.getElementById('lo').onclick = () => { state.setAuth('public', 'all'); location.hash = '#/' };
}
