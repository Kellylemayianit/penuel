const routes = {};
export const route = (path, fn) => { routes[path] = fn };
export const current = () => location.hash.replace(/^#/, '') || '/';
export function refresh() { (routes[current()] || routes['/'])?.() }
export function start() { addEventListener('hashchange', refresh); refresh() }
