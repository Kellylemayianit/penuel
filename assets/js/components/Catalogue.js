import { state, esc, money, BRAND } from '../state.js';
import plaza from '../data/plaza.js';
import stopover from '../data/stopover.js';

export const dataFor = b => (b === 'plaza' ? plaza : stopover);
export const ICON = { rooms: '🛏️', experiences: '🦁', dining: '🍽️', retail: '🛒', automotive: '🚗' };
const LABEL = { rooms: 'Room', experiences: 'Experience', dining: 'Dining', retail: 'Shop', automotive: 'Auto' };
const S = f => { try { return f() ?? [] } catch (e) { console.warn('Catalogue data issue:', e); return [] } };
const track = (title, items, brand) => ({ title, items: items.map(i => ({ ...i, brand })) });

// Flattens each brand's JSON into { title, items[] } tracks. Every normaliser is guarded so one bad record never blanks the page.
export function normalise(b) {
  if (b === 'empire') return [...normalise('plaza'), ...normalise('stopover')];
  const d = dataFor(b), u = d.units || {};
  if (b === 'plaza') return [
    track('Rooms & Suites', S(() => d.rooms.map(r => ({ id: r.id, name: r.type, desc: r.description, meta: [`Sleeps ${r.capacity}`], tags: r.amenities || [], price: r.rate_nightly, cur: 'USD', unit: '/ night', dept: 'rooms' }))), b),
    track('Experiences', S(() => d.experiences.map(e => ({ id: e.id, name: e.name, desc: e.description, meta: [`${e.duration_hours} hrs`, e.group_size], tags: [], price: e.price_per_person, cur: 'USD', unit: '/ person', dept: 'experiences' }))), b),
    track('Dining', S(() => d.dining.map(x => ({ id: x.id, name: x.name, desc: `${x.cuisine} · ${x.service_hours}`, meta: [`Seats ${x.capacity}`], tags: [], price: x.average_meal_price, cur: 'USD', unit: 'avg meal', dept: 'dining' }))), b)
  ].filter(t => t.items.length);
  return [
    ...S(() => u.retail.categories).map(c => track(`Shop: ${c.name}`, S(() => c.items.map(i => ({ id: i.id, name: i.product, desc: '', meta: [`${i.stock} in stock`], tags: [], price: i.price, cur: 'KES', dept: 'retail', out: i.stock <= 0 }))), b)),
    ...S(() => u.dining.menu_categories).map(c => track(`Restaurant: ${c.name}`, S(() => c.items.map(i => ({ id: i.id, name: i.dish, desc: '', meta: [`${i.prep_time_minutes} min`], tags: [], price: i.price, cur: 'KES', dept: 'dining', out: i.availability === false }))), b)),
    track('Car Wash & Service Bay', S(() => u.automotive.services.map(s => ({ id: s.service_id, name: s.name, desc: `Suitable for: ${s.suitable_for}`, meta: [`${s.duration_minutes} min`], tags: [], price: s.price, cur: 'KES', dept: 'automotive' }))), b),
    track('Spare Parts', S(() => u.automotive.spare_parts.map(p => ({ id: p.part_id, name: p.name, desc: '', meta: [`${p.stock} in stock`], tags: [], price: p.price, cur: 'KES', dept: 'automotive', out: p.stock <= 0 }))), b)
  ].filter(t => t.items.length);
}
export const findItem = id => normalise('empire').flatMap(t => t.items).find(i => i.id === id);
const count = b => normalise(b).reduce((a, t) => a + t.items.length, 0);

const scard = (i, oos) => { const out = i.out || oos.includes(i.id);
  return `<article class="scard scard--aura-${i.brand} ${out ? 'scard--out' : ''}" tabindex="0" data-go="#/item/${esc(i.id)}"><div class="scard__hero"><div class="scard__hero-overlay"></div>
    <span class="scard__badge scard__badge--default">${out ? 'Sold out' : LABEL[i.dept]}</span><span class="scard__icon-over">${ICON[i.dept]}</span></div>
    <div class="scard__body"><h4 class="scard__title">${esc(i.name)}</h4>${i.desc ? `<p class="scard__desc">${esc(i.desc)}</p>` : ''}
    <div class="scard__meta">${i.meta.map(esc).join(' · ')}</div>${i.tags.length ? `<ul class="scard__tags">${i.tags.slice(0, 3).map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="scard__footer"><span class="scard__price">${money(i.price, i.cur)} <small>${esc(i.unit || '')}</small></span><span class="scard__arrow">→</span></div></div></article>`; };

export function renderCatalogue() {
  const b = state.activeBranch, oos = state.outOfStock(), B = BRAND[b];
  const strip = `<div class="aura-strip"><div class="aura-strip__inner"><div class="aura-strip__meta"><span class="aura-strip__name">${B.icon} ${esc(B.tag)}</span><span class="aura-strip__loc">📍 ${esc(B.loc)}</span></div>
    <div class="aura-strip__btns">${['empire', 'plaza', 'stopover'].map(x => `<button class="aura-btn aura-btn--${x} ${b === x ? 'is-active' : ''}" data-aura="${x}">${BRAND[x].icon} ${BRAND[x].name}</button>`).join('')}</div></div></div>`;
  const body = b === 'empire'
    ? `<div class="empire-grid"><div class="empire-grid__intro"><h2>Choose a property</h2><p>Each property has its own services, prices and team.</p></div><div class="empire-grid__cards">
       ${['plaza', 'stopover'].map(x => `<button class="emp-card" data-aura="${x}"><span class="emp-card__icon">${BRAND[x].icon}</span><span class="emp-card__label">Penuel ${BRAND[x].name}</span>
       <p class="emp-card__tagline">${esc(BRAND[x].tag)}</p><span class="emp-card__count">${count(x)} services</span><span class="emp-card__cta">Explore →</span></button>`).join('')}</div></div>`
    : `<section class="brand-sect"><div class="brand-sect__head"><span class="brand-sect__emoji">${B.icon}</span><div class="brand-sect__copy"><h2 class="brand-sect__name">Penuel ${B.name}</h2><p class="brand-sect__tagline">${esc(B.tag)}</p></div></div><div class="brand-sect__rule"></div>
       ${normalise(b).map(t => `<div class="slideshow"><div class="slideshow__header"><div class="slideshow__title-group"><h3 class="slideshow__title">${esc(t.title)}</h3><span class="slideshow__count">${t.items.length}</span></div>
       <div class="slideshow__arrows"><button class="arrow-btn" aria-label="Previous">‹</button><button class="arrow-btn" aria-label="Next">›</button></div></div>
       <div class="slideshow__track">${t.items.map(i => scard(i, oos)).join('')}</div></div>`).join('') || '<div class="cat-empty"><h3>Nothing to show yet</h3></div>'}</section>`;
  document.getElementById('app-root').innerHTML = `<div class="catalogue"><section class="cat-hero"><div class="cat-hero__glow"></div><div class="cat-hero__noise"></div><div class="cat-hero__content">
    <p class="cat-hero__eyebrow">Penuel ${B.name}</p><h1 class="cat-hero__heading">Our <span class="gradient-text">Services</span></h1><p class="cat-hero__sub">Pick what you need and pay with M-Pesa.</p></div></section>
    ${strip}<div class="cat-body"><div class="brand-view">${body}</div></div></div>`;
  document.querySelectorAll('.slideshow').forEach(s => { const t = s.querySelector('.slideshow__track'); s.querySelectorAll('.arrow-btn').forEach((a, n) => a.onclick = () => t.scrollBy({ left: n ? 300 : -300, behavior: 'smooth' })) });
  document.querySelectorAll('.scard').forEach(c => c.onkeydown = e => { if (e.key === 'Enter') location.hash = c.dataset.go.slice(1) });
}
