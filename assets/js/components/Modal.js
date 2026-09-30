import { state, esc, money } from '../state.js';
import { triggerStkPush, normalisePhone, toKes } from '../api/client.js';

const root = () => document.getElementById('modal-root');
export function closeModal() { root().innerHTML = '' }
function open(html) {
  root().innerHTML = `<div class="modal-back" id="mb2"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  document.getElementById('mb2').onclick = e => { if (e.target.id === 'mb2') closeModal() };
  root().querySelector('input,select,button')?.focus();
}
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });

export function openCheckout(item) {
  const kes = toKes(item);
  open(`<h2>${esc(item.name)}</h2><p class="muted">${esc(item.desc)}</p>
    <p style="margin-top:10px"><b>${money(item.price, item.cur)}</b> <span class="muted">${esc(item.unit || '')}</span>
    ${item.cur === 'USD' ? `<br><span class="muted">Charged as ${money(kes)} via M-Pesa</span>` : ''}</p>
    <div class="field"><label for="ph">M-Pesa phone number</label><input id="ph" inputmode="tel" placeholder="0712 345 678" autocomplete="tel"></div>
    <div class="field"><label for="nt">Note (dates, room number, car plate, table)</label><input id="nt" maxlength="60"></div>
    <div id="mm" class="msg" aria-live="polite"></div>
    <div class="row"><button class="btn ghost" id="cx">Cancel</button><button class="btn" id="pay">Pay ${money(kes)}</button></div>`);
  const mm = document.getElementById('mm');
  document.getElementById('cx').onclick = closeModal;
  document.getElementById('pay').onclick = async e => {
    const phone = normalisePhone(document.getElementById('ph').value);
    if (!phone) { mm.className = 'msg err'; mm.textContent = 'Enter a valid Safaricom number, e.g. 0712345678.'; return }
    const btn = e.target; btn.disabled = true; mm.className = 'msg'; mm.textContent = 'Check your phone and enter your M-Pesa PIN…';
    const r = await triggerStkPush(phone, kes, 'PE-' + item.id);
    if (r?.success) {
      state.addOrder({ branch: state.activeBranch, dept: item.dept, itemId: item.id, item: item.name, price: kes, phone, note: document.getElementById('nt').value.trim() });
      mm.className = 'msg ok'; mm.textContent = 'Payment received. Your order has been sent to our team.';
      btn.textContent = 'Done'; btn.onclick = closeModal; btn.disabled = false;
    } else { mm.className = 'msg err'; mm.textContent = r?.message || 'Payment failed. Try again.'; btn.disabled = false }
  };
}
