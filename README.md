# Penuel Empire Portal (vanilla JS)
Same portal as the React/Vite version, with your original stylesheets and no build step.
Hash routing means any static host works with no rewrite rules.
    python3 -m http.server 8000   # ES modules need a server, then open http://localhost:8000
Routes: /#/  /#/about  /#/catalogue  /#/item/<id>  /#/gate  /#/dashboard
Themes: Empire (orange), Plaza (gold), Stopover (navy/blue), applied as body.theme-* like the React app.
Styles: assets/css/*.css are your files (the @import lines were removed; fonts load from index.html). extra.css holds the few additions.
Data: assets/js/data/plaza.js and stopover.js are your existing JSON.
Before launch: set DEMO_MODE=false in assets/js/api/client.js and implement /api/login and /api/stkpush in the Cloudflare Worker.
Plaza prices are USD in the data (currency says KES); KES_PER_USD in client.js sets the M-Pesa charge.
