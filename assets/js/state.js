const get = k => { try { return localStorage.getItem(k) } catch { return null } };
const put = (k, v) => { try { localStorage.setItem(k, v) } catch {} };
const load = (k, d) => { try { return JSON.parse(get(k)) ?? d } catch { return d } };
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = n => 'KES ' + Number(n).toLocaleString('en-KE');

export const state = {
  activeBranch: get('penuel_branch') || 'plaza',
  userRole: get('penuel_role') || 'public', // 'public' | 'staff' | 'ceo'
  userDept: get('penuel_dept') || 'all',
  cart: [],

  setBranch(branch) {
    this.activeBranch = branch.toLowerCase();
    put('penuel_branch', this.activeBranch);
    document.documentElement.setAttribute('data-theme', this.activeBranch);
    window.dispatchEvent(new CustomEvent('aura-sync', { detail: { branch: this.activeBranch } }));
  },
  setAuth(role, dept = 'all') {
    this.userRole = role; this.userDept = dept;
    put('penuel_role', role); put('penuel_dept', dept);
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { role, dept } }));
  },

  // Demo persistence (localStorage). Swap for Worker/database calls in production.
  orders: () => load('penuel_orders', []),
  outOfStock: () => load('penuel_oos', []),
  log: () => load('penuel_log', []),
  _emit() { window.dispatchEvent(new CustomEvent('data-changed')) },
  addLog(text) {
    const l = this.log(); l.unshift({ ts: Date.now(), by: this.userRole === 'public' ? 'customer' : `${this.userRole}/${this.userDept}`, text });
    put('penuel_log', JSON.stringify(l.slice(0, 100)));
  },
  addOrder(o) {
    const list = this.orders(); list.unshift({ id: 'PE' + Date.now().toString(36).toUpperCase(), ts: Date.now(), status: 'new', ...o });
    put('penuel_orders', JSON.stringify(list)); this.addLog(`New order: ${o.item} (${money(o.price)})`); this._emit();
  },
  setStatus(id, status) {
    const list = this.orders(); const o = list.find(x => x.id === id); if (!o) return;
    o.status = status; put('penuel_orders', JSON.stringify(list)); this.addLog(`Order ${id} marked ${status}`); this._emit();
  },
  toggleStock(id) {
    const s = this.outOfStock(); const i = s.indexOf(id);
    i < 0 ? s.push(id) : s.splice(i, 1);
    put('penuel_oos', JSON.stringify(s)); this.addLog(`${id} ${i < 0 ? 'marked out of stock' : 'back in stock'}`); this._emit();
  }
};
