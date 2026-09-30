const WORKER_URL = 'https://pay.penuelempire.co.ke'; // Cloudflare Worker endpoint
export const DEMO_MODE = true; // set false once the Worker is deployed
export const KES_PER_USD = 129; // Plaza prices are in USD; confirm the rate you want to charge at

export const toKes = item => item.cur === 'USD' ? Math.round(item.price * KES_PER_USD) : item.price;

export const normalisePhone = p => {
  const d = String(p).replace(/\D/g, '');
  if (/^0[17]\d{8}$/.test(d)) return '254' + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  return null;
};

// DEMO ONLY credentials. In production the Worker checks these and returns a signed session.
export const DEPTS = ['rooms', 'experiences', 'dining', 'retail', 'automotive'];
const DEMO_USERS = { 'owner@penuel.com': { pw: 'owner123', role: 'ceo', dept: 'all' },
  ...Object.fromEntries(DEPTS.map(d => [`${d}@penuel.com`, { pw: `${d}123`, role: 'staff', dept: d }])) };

export async function login(email, password) {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 500));
    const u = DEMO_USERS[String(email).trim().toLowerCase()];
    return u && u.pw === password ? { ok: true, role: u.role, dept: u.dept } : { ok: false, message: 'Incorrect email or password.' };
  }
  try {
    const r = await fetch(`${WORKER_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    return await r.json();
  } catch { return { ok: false, message: 'Could not reach the login service.' } }
}

export async function triggerStkPush(phoneNumber, amount, accountRef) {
  if (DEMO_MODE) { await new Promise(r => setTimeout(r, 900)); return { success: true, message: 'Demo: payment simulated.' } }
  try {
    const response = await fetch(`${WORKER_URL}/api/stkpush`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber, amount, reference: accountRef })
    });
    return await response.json();
  } catch (error) {
    console.error('M-Pesa Gateway Error:', error);
    return { success: false, message: 'Network error connecting to payment gateway.' };
  }
}
