import { state, esc, money } from '../state.js';
import { openCheckout } from './Modal.js';
import plaza from '../data/plaza.js';
import stopover from '../data/stopover.js';

export const dataFor = b => (b === 'plaza' ? plaza : stopover);

export function renderCatalogue() {
  const data = dataFor(state.activeBranch), oos = state.outOfStock(), items = {};
  document.getElementById('app-root').innerHTML = `<div class="wrap"><div class="hero" style="padding-bottom:0"><h1 style="font-size:2rem">${esc(data.name)}</h1></div>
    ${(data?.tracks ?? []).map(t => `<section class="track"><h2>${esc(t?.title)}</h2><div class="scroller">
      ${(t?.items ?? []).map(i => { items[i.id] = i; const out = oos.includes(i.id);
        return `<button class="card" data-id="${esc(i.id)}" ${out ? 'disabled' : ''}><span class="icon">${i?.icon ?? ''}</span><b>${esc(i?.name)}</b>
        <span class="muted">${esc(i?.desc)}</span><span class="price">${out ? 'Sold out' : money(i?.price ?? 0)}</span></button>` }).join('')}
    </div></section>`).join('')}</div>`;
  document.querySelectorAll('.card').forEach(c => c.onclick = () => openCheckout(items[c.dataset.id]));
}
