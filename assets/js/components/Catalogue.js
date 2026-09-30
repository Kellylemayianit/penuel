import { state, esc, money } from '../state.js';
import { openCheckout } from './Modal.js';
import plaza from '../data/plaza.js';
import stopover from '../data/stopover.js';

export const dataFor = b => (b === 'plaza' ? plaza : stopover);
const ICON = { rooms: '🛏️', experiences: '🦁', dining: '🍽️', retail: '🛒', automotive: '🚗' };
const S = f => { try { return f() ?? [] } catch (e) { console.warn('Catalogue data issue:', e); return [] } };
const track = (title, items) => ({ title, items });

// Flattens each branch's JSON into { title, items[] } tracks. Each normaliser is guarded so one bad record never blanks the page.
export function normalise(b) {
  const d = dataFor(b), u = d.units || {};
  if (b === 'plaza') return [
    track('Rooms & Suites', S(() => d.rooms.map(r => ({ id: r.id, name: r.type, desc: r.description, meta: [`Sleeps ${r.capacity}`, ...(r.amenities || []).slice(0, 3)], price: r.rate_nightly, cur: 'USD', unit: '/ night', dept: 'rooms' })))),
    track('Experiences', S(() => d.experiences.map(e => ({ id: e.id, name: e.name, desc: e.description, meta: [`${e.duration_hours} hrs`, e.group_size], price: e.price_per_person, cur: 'USD', unit: '/ person', dept: 'experiences' })))),
    track('Dining', S(() => d.dining.map(x => ({ id: x.id, name: x.name, desc: `${x.cuisine} · ${x.service_hours}`, meta: [`Seats ${x.capacity}`], price: x.average_meal_price, cur: 'USD', unit: 'avg meal', dept: 'dining' }))))
  ].filter(t => t.items.length);
  return [
    ...S(() => u.retail.categories).map(c => track(`Shop: ${c.name}`, S(() => c.items.map(i => ({ id: i.id, name: i.product, desc: '', meta: [`${i.stock} in stock`], price: i.price, cur: 'KES', dept: 'retail', out: i.stock <= 0 }))))),
    ...S(() => u.dining.menu_categories).map(c => track(`Restaurant: ${c.name}`, S(() => c.items.map(i => ({ id: i.id, name: i.dish, desc: '', meta: [`${i.prep_time_minutes} min`], price: i.price, cur: 'KES', dept: 'dining', out: i.availability === false }))))),
    track('Car Wash & Service Bay', S(() => u.automotive.services.map(s => ({ id: s.service_id, name: s.name, desc: `Suitable for: ${s.suitable_for}`, meta: [`${s.duration_minutes} min`], price: s.price, cur: 'KES', dept: 'automotive' })))),
    track('Spare Parts', S(() => u.automotive.spare_parts.map(p => ({ id: p.part_id, name: p.name, desc: '', meta: [`${p.stock} in stock`], price: p.price, cur: 'KES', dept: 'automotive', out: p.stock <= 0 }))))
  ].filter(t => t.items.length);
}

export function renderCatalogue() {
  const b = state.activeBranch, oos = state.outOfStock(), items = {};
  document.getElementById('app-root').innerHTML = `<div class="wrap"><div class="hero" style="padding-bottom:0"><h1 style="font-size:2.2rem">${esc(dataFor(b)?.branch)}</h1><p class="muted" style="margin:0">Choose what you need and pay with M-Pesa.</p></div>
    ${normalise(b).map(t => `<section class="track"><h2>${esc(t.title)}</h2><div class="scroller">
      ${t.items.map(i => { items[i.id] = i; const out = i.out || oos.includes(i.id);
        return `<button class="card" data-id="${esc(i.id)}" ${out ? 'disabled' : ''}><span class="icon">${ICON[i.dept] || ''}</span><b>${esc(i.name)}</b>
        ${i.desc ? `<span class="muted">${esc(i.desc)}</span>` : ''}<span class="chips">${(i.meta || []).map(m => `<span class="chip">${esc(m)}</span>`).join('')}</span>
        <span class="price">${out ? 'Sold out' : `${money(i.price, i.cur)} <small class="muted">${esc(i.unit || '')}</small>`}</span></button>` }).join('')}
    </div></section>`).join('') || '<p class="muted">Nothing to show yet.</p>'}</div>`;
  document.querySelectorAll('.card').forEach(c => c.onclick = () => openCheckout(items[c.dataset.id]));
}
