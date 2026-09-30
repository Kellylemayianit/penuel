import { state, esc, money } from '../state.js';
import { normalise } from './Catalogue.js';

const NEXT = { new: ['accepted', 'Accept'], accepted: ['done', 'Mark fulfilled'] };
const fmt = ts => new Date(ts).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' });

export function renderDashboard() {
  if (state.userRole === 'public') { location.hash = '#/gate'; return }
  const root = document.getElementById('app-root');
  root.innerHTML = `<div class="wrap">${state.userRole === 'ceo' ? ceo() : staff()}</div>`;
  root.querySelectorAll('[data-act]').forEach(b => b.onclick = () => state.setStatus(b.dataset.id, b.dataset.act));
  root.querySelectorAll('[data-stock]').forEach(b => b.onclick = () => state.toggleStock(b.dataset.stock));
}

function orderRow(o) {
  const n = NEXT[o.status];
  return `<div class="order"><div class="grow"><b>${esc(o.item)}</b> <span class="pill">${esc(o.status)}</span><br>
    <span class="muted">${esc(o.id)} · ${esc(o.branch)} · ${esc(o.dept)} · ${fmt(o.ts)}${o.note ? ' · ' + esc(o.note) : ''}</span></div>
    <b>${money(o.price)}</b>${n ? `<button class="btn" data-act="${n[0]}" data-id="${esc(o.id)}">${n[1]}</button>` : ''}</div>`;
}

function staff() {
  const d = state.userDept, oos = state.outOfStock();
  const mine = state.orders().filter(o => d === 'all' || o.dept === d);
  const open = mine.filter(o => o.status !== 'done'), done = mine.filter(o => o.status === 'done');
  const items = normalise(state.activeBranch).flatMap(t => t.items).filter(i => i.dept === d);
  return `<div class="hero" style="padding-bottom:0"><h1 style="font-size:2rem">${esc(d)} queue</h1><p class="muted">Orders for your department across both branches.</p></div>
    <div class="panel"><h3>Open orders (${open.length})</h3>${open.map(orderRow).join('') || '<p class="muted">No open orders. New payments appear here.</p>'}</div>
    <div class="panel"><h3>Stock (${esc(state.activeBranch)})</h3>${items.map(i => `<div class="order"><span class="grow">${esc(i.name)}</span>
      <button class="btn ghost" data-stock="${esc(i.id)}">${oos.includes(i.id) ? 'Back in stock' : 'Mark out of stock'}</button></div>`).join('') || '<p class="muted">No items for this department on the active branch. Use Switch to change branch.</p>'}</div>
    <div class="panel"><h3>Fulfilled (${done.length})</h3>${done.slice(0, 10).map(orderRow).join('') || '<p class="muted">Nothing fulfilled yet.</p>'}</div>`;
}

function ceo() {
  const all = state.orders();
  const sum = f => all.filter(f).reduce((a, o) => a + o.price, 0);
  const by = k => Object.entries(all.reduce((m, o) => (m[o[k]] = (m[o[k]] || 0) + o.price, m), {}));
  const bars = e => { const max = Math.max(1, ...e.map(x => x[1])); return e.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><i style="width:${Math.max(4, v / max * 100)}%"></i><b>${money(v)}</b></div>`).join('') || '<p class="muted">No revenue yet.</p>' };
  return `<div class="hero" style="padding-bottom:0"><h1 style="font-size:2rem">Owner dashboard</h1></div>
    <div class="stats">
      <div class="panel stat"><span class="muted">Total revenue</span><b>${money(sum(() => true))}</b></div>
      <div class="panel stat"><span class="muted">Penuel Plaza</span><b>${money(sum(o => o.branch === 'plaza'))}</b></div>
      <div class="panel stat"><span class="muted">Penuel Stopover</span><b>${money(sum(o => o.branch === 'stopover'))}</b></div>
      <div class="panel stat"><span class="muted">Open orders</span><b>${all.filter(o => o.status !== 'done').length}</b></div></div>
    <div class="panel"><h3>Revenue by department</h3><div class="bars bar-wrap">${bars(by('dept'))}</div></div>
    <div class="panel"><h3>Recent orders</h3>${all.slice(0, 8).map(orderRow).join('') || '<p class="muted">No orders yet.</p>'}</div>
    <div class="panel"><h3>Staff activity</h3>${state.log().slice(0, 30).map(l => `<div class="log">${fmt(l.ts)} · ${esc(l.by)} · ${esc(l.text)}</div>`).join('') || '<p class="muted">No activity yet.</p>'}</div>`;
}
