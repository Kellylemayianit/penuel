import { state, esc, money } from '../state.js';
import { triggerStkPush, normalisePhone, toKes } from '../api/client.js';
import { findItem, ICON } from './Catalogue.js';

const day = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
export function renderItem(id) {
  const root = document.getElementById('app-root'), it = findItem(id);
  if (!it) { root.innerHTML = `<div class="pd"><div class="pd-loading"><h2 class="pd-loading__title">Item not found</h2><p class="pd-loading__sub">It may have been removed or the link is wrong.</p><button class="pd-loading__btn" data-go="#/catalogue">Back to services</button></div></div>`; return }
  const b = it.brand, room = it.dept === 'rooms', guests = room || it.dept === 'experiences';
  root.innerHTML = `<div class="pd pd--${b}"><section class="pd-hero"><div class="pd-hero__overlay"></div><div class="pd-hero__noise"></div>
    <button class="pd-back" data-go="#/catalogue">← Back to services</button><div class="pd-hero__branch"><span class="pd-branch-tag pd-branch-tag--${b}">Penuel ${b === 'plaza' ? 'Plaza' : 'Stopover'}</span></div>
    <div class="pd-hero__content"><span class="pd-hero__emoji">${ICON[it.dept]}</span><h1 class="pd-hero__title">${esc(it.name)}</h1><div class="pd-hero__meta">${it.meta.map(esc).join(' · ')}</div></div></section>
    <div class="pd-body"><div>${it.desc ? `<div class="pd-section"><h2 class="pd-section__heading">About</h2><p class="pd-desc">${esc(it.desc)}</p></div>` : ''}
      ${it.tags.length ? `<div class="pd-section"><h2 class="pd-section__heading">Included</h2><ul class="pd-amenities">${it.tags.map(t => `<li class="pd-amenity"><span class="pd-amenity__icon">✓</span>${esc(t)}</li>`).join('')}</ul></div>` : ''}</div>
    <aside class="pd-sidebar"><div class="booking-panel booking-panel--${b}"><div class="booking-panel__header"><span class="booking-panel__tag">${it.out ? 'Sold out' : 'Available'}</span><div class="booking-panel__price">${money(it.price, it.cur)} <small>${esc(it.unit || '')}</small></div></div>
    ${room ? `<div class="booking-panel__dates"><div class="date-picker"><label class="date-picker__label" for="d1">Check in</label><input class="date-picker__input" id="d1" type="date" min="${day(0)}" value="${day(1)}"></div>
      <div class="date-picker"><label class="date-picker__label" for="d2">Check out</label><input class="date-picker__input" id="d2" type="date" min="${day(1)}" value="${day(2)}"></div></div>` : ''}
    <div><div class="booking-panel__guest-label">${guests ? 'Guests' : 'Quantity'}</div><div class="booking-panel__guest-row"><button class="guest-btn" id="mi" aria-label="Fewer">−</button><span class="guest-count" id="q">1</span><button class="guest-btn" id="pl" aria-label="More">+</button></div></div>
    <div class="ticket-phone"><label class="ticket-phone__label" for="ph">M-Pesa number</label><div class="ticket-phone__row"><span class="ticket-phone__prefix">+254</span><input class="ticket-phone__input" id="ph" inputmode="tel" placeholder="712 345 678" autocomplete="tel"></div></div>
    <div class="booking-panel__summary"><div class="booking-summary-row"><span id="sl"></span><span id="sv"></span></div><div class="booking-summary-row booking-summary-row--total"><span>Total</span><span class="booking-total" id="tt"></span></div></div>
    <div id="mm" class="muted" aria-live="polite" style="font-size:.85rem"></div>
    <button class="book-btn book-btn--${b}" id="pay" ${it.out ? 'disabled' : ''}>Pay with M-Pesa</button><div class="booking-panel__note">Secure STK push to your phone</div></div></aside></div></div>`;
  const $ = x => document.getElementById(x); let q = 1;
  const nights = () => room ? Math.max(1, Math.round((new Date($('d2').value) - new Date($('d1').value)) / 864e5) || 1) : 1;
  const total = () => it.price * q * nights(), kes = () => toKes({ ...it, price: total() });
  const calc = () => { $('q').textContent = q; $('sl').textContent = `${money(it.price, it.cur)} × ${q}${room ? ` × ${nights()} night(s)` : ''}`; $('sv').textContent = money(total(), it.cur);
    $('tt').textContent = it.cur === 'USD' ? `${money(total(), 'USD')} ≈ ${money(kes())}` : money(kes()); $('pay').textContent = `Pay ${money(kes())} with M-Pesa` };
  $('mi').onclick = () => { q = Math.max(1, q - 1); calc() }; $('pl').onclick = () => { q = Math.min(20, q + 1); calc() };
  if (room) { $('d1').onchange = () => { $('d2').min = $('d1').value; if ($('d2').value <= $('d1').value) $('d2').value = new Date(new Date($('d1').value).getTime() + 864e5).toISOString().slice(0, 10); calc() }; $('d2').onchange = calc }
  calc();
  $('pay').onclick = async e => {
    const phone = normalisePhone('0' + $('ph').value.replace(/\D/g, '').replace(/^(254|0)/, ''));
    if (!phone) { $('mm').className = 'msg err'; $('mm').style.color = '#ff7b6b'; $('mm').textContent = 'Enter a valid Safaricom number, e.g. 712 345 678.'; return }
    const btn = e.currentTarget; btn.disabled = true; $('mm').style.color = ''; $('mm').textContent = 'Check your phone and enter your M-Pesa PIN…';
    const r = await triggerStkPush(phone, kes(), 'PE-' + it.id);
    if (r?.success) {
      state.addOrder({ branch: b, dept: it.dept, itemId: it.id, item: it.name, price: kes(), phone, note: `${q}${guests ? ' guest(s)' : ' x'}${room ? `, ${$('d1').value} to ${$('d2').value}` : ''}` });
      btn.outerHTML = `<div class="booking-confirm booking-confirm--${b}">Payment received. Your order is with our team.</div>`; $('mm').textContent = '';
    } else { $('mm').style.color = '#ff7b6b'; $('mm').textContent = r?.message || 'Payment failed. Try again.'; btn.disabled = false }
  };
}
