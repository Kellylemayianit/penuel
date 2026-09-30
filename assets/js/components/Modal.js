import { state, esc, money } from '../state.js';
import { triggerStkPush, normalisePhone } from '../api/client.js';

const root = () => document.getElementById('modal-root');
export function closeModal() { root().innerHTML = '' }
function open(html) {
  root().innerHTML = `<div class="modal-back" id="mb"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  document.getElementById('mb').onclick = e => { if (e.target.id === 'mb') closeModal() };
  root().querySelector('input,select,button')?.focus();
}
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });

export function openCheckout(item) {
  open(`<h2>${esc(item.name)}</h2><p class="muted">${esc(item.desc)}</p>
    <p style="margin-top:10px"><b>${money(item.price)}</b></p>
    <div class="field"><label for="ph">M-Pesa phone number</label><input id="ph" inputmode="tel" placeholder="0712 345 678" autocomplete="tel"></div>
    <div class="field"><label for="nt">Note (room number, car plate, table)</label><input id="nt" maxlength="60"></div>
    <div id="mm" class="msg" aria-live="polite"></div>
    <div class="row"><button class="btn ghost" id="cx">Cancel</button><button class="btn" id="pay">Pay with M-Pesa</button></div>`);
  const mm = document.getElementById('mm');
  document.getElementById('cx').onclick = closeModal;
  document.getElementById('pay').onclick = async e => {
    const phone = normalisePhone(document.getElementById('ph').value);
    if (!phone) { mm.className = 'msg err'; mm.textContent = 'Enter a valid Safaricom number, e.g. 0712345678.'; return }
    const btn = e.target; btn.disabled = true; mm.className = 'msg'; mm.textContent = 'Check your phone and enter your M-Pesa PIN…';
    const r = await triggerStkPush(phone, item.price, 'PE-' + item.id);
    if (r?.success) {
      state.addOrder({ branch: state.activeBranch, dept: item.dept, itemId: item.id, item: item.name, price: item.price, phone, note: document.getElementById('nt').value.trim() });
      mm.className = 'msg ok'; mm.textContent = 'Payment received. Your order has been sent to our team.';
      btn.textContent = 'Done'; btn.onclick = closeModal; btn.disabled = false;
    } else { mm.className = 'msg err'; mm.textContent = r?.message || 'Payment failed. Try again.'; btn.disabled = false }
  };
}

// DEMO ONLY: client-side PINs are not real security. Verify credentials in the Worker for production.
const PINS = { staff: '1234', ceo: '0000' };
const DEPTS = ['rooms', 'restaurant', 'carwash', 'supermarket', 'service'];
export function openLogin() {
  open(`<h2>Staff login</h2>
    <div class="field"><label for="rl">Role</label><select id="rl"><option value="staff">Staff</option><option value="ceo">CEO / Owner</option></select></div>
    <div class="field" id="dw"><label for="dp">Department</label><select id="dp">${DEPTS.map(d => `<option>${d}</option>`).join('')}</select></div>
    <div class="field"><label for="pn">PIN</label><input id="pn" type="password" inputmode="numeric" autocomplete="off"></div>
    <div id="lm" class="msg err" aria-live="polite"></div>
    <div class="row"><button class="btn ghost" id="cx">Cancel</button><button class="btn" id="go">Sign in</button></div>`);
  const rl = document.getElementById('rl');
  rl.onchange = () => document.getElementById('dw').style.display = rl.value === 'ceo' ? 'none' : '';
  document.getElementById('cx').onclick = closeModal;
  document.getElementById('go').onclick = () => {
    if (document.getElementById('pn').value !== PINS[rl.value]) { document.getElementById('lm').textContent = 'Incorrect PIN.'; return }
    state.setAuth(rl.value, rl.value === 'ceo' ? 'all' : document.getElementById('dp').value);
    closeModal(); location.hash = '#/management';
  };
}
