# Penuel Empire Portal
Zero-dependency vanilla JS SPA. ES modules need a server (not file://):
    python3 -m http.server 8000   # then open http://localhost:8000
Routes: /#/  /#/catalogue  /#/management
Demo logins (client-side only, replace before launch): staff PIN 1234, CEO PIN 0000.
Payments: DEMO_MODE in assets/js/api/client.js simulates STK Push; set it false once the Cloudflare Worker at WORKER_URL is live.
Orders, stock and activity logs persist in localStorage for the demo; move them to the Worker/database for multi-device use.
