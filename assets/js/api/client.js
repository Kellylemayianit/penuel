const WORKER_URL = 'https://pay.penuelempire.co.ke'; // Cloudflare Worker endpoint
const DEMO_MODE = true; // set false once the Worker is deployed

export const normalisePhone = p => {
  const d = String(p).replace(/\D/g, '');
  if (/^0[17]\d{8}$/.test(d)) return '254' + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  return null;
};

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
