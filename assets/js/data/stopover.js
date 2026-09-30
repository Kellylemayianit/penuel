export default { name: 'Penuel Stopover', tagline: 'Fuel up, eat, shop and get back on the road', tracks: [
  { title: 'Car Wash', items: [
    { id: 'st-cw-basic', name: 'Quick Wash', desc: 'Exterior wash and dry.', price: 400, dept: 'carwash', icon: '🚿' },
    { id: 'st-cw-full', name: 'Full Valet', desc: 'Interior vacuum, exterior wash, tyre shine.', price: 1200, dept: 'carwash', icon: '🚗' },
    { id: 'st-cw-eng', name: 'Engine Wash', desc: 'Degrease and rinse.', price: 800, dept: 'carwash', icon: '🔧' } ] },
  { title: 'Restaurant', items: [
    { id: 'st-rs-chai', name: 'Chai & Mandazi', desc: 'Quick road-trip breakfast.', price: 250, dept: 'restaurant', icon: '☕' },
    { id: 'st-rs-pilau', name: 'Chicken Pilau', desc: 'Served with kachumbari.', price: 700, dept: 'restaurant', icon: '🍛' },
    { id: 'st-rs-burg', name: 'Burger & Fries', desc: 'Beef burger with a side of fries.', price: 850, dept: 'restaurant', icon: '🍔' } ] },
  { title: 'Supermarket', items: [
    { id: 'st-sm-water', name: 'Water 5L', desc: 'Drinking water.', price: 220, dept: 'supermarket', icon: '💧' },
    { id: 'st-sm-snack', name: 'Travel Snack Pack', desc: 'Crisps, biscuits and juice.', price: 650, dept: 'supermarket', icon: '🛍️' } ] },
  { title: 'Service Bay', items: [
    { id: 'st-sb-tyre', name: 'Tyre Check & Inflate', desc: 'Pressure check on all four tyres.', price: 300, dept: 'service', icon: '🛞' },
    { id: 'st-sb-oil', name: 'Oil Change', desc: 'Labour only; oil billed separately.', price: 1500, dept: 'service', icon: '🛢️' } ] }
] };
