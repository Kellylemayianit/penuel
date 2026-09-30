const routes = {};
export const route = (path, fn) => { routes[path] = fn };
export const current = () => location.hash.replace(/^#/, '') || '/';
export function refresh() { window.scrollTo(0, 0); (routes[current()] || routes['/'])?.() }
export function start() { addEventListener('hashchange', refresh); refresh() }
