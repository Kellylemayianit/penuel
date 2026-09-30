# Penuel Empire Portal (vanilla JS)
Same portal as the React/Vite version, with no build step. Hash routing means any static host works with no rewrite rules.
    python3 -m http.server 8000   # ES modules need a server, then open http://localhost:8000
Routes: /#/  /#/about  /#/catalogue  /#/gate  /#/dashboard
Data: assets/js/data/plaza.js and stopover.js are your existing JSON, unchanged.
Before launch: set DEMO_MODE=false in assets/js/api/client.js and implement /api/login and /api/stkpush in the Cloudflare Worker.
Plaza prices are USD in the data (currency says KES); KES_PER_USD in client.js sets the M-Pesa charge.
