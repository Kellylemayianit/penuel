const routes = {};
export const route = (path, fn) => { routes[path] = fn };
export const current = () => location.hash.replace(/^#/, '') || '/';
// '/item/room_001' runs the '/item' route with 'room_001' as its argument
export function refresh() { const [, seg = '', ...rest] = current().split('/'); (routes['/' + seg] || routes['/'])?.(rest.join('/')) }
export function start() { addEventListener('hashchange', () => { window.scrollTo(0, 0); refresh() }); refresh() }
