export default {
 "branch": "Penuel Stopover",
 "type": "Multi-Service Hub",
 "location": "Highway Rest Stop - Amboseli Corridor",
 "currency": "KES",
 "operating_hours": "24/7",
 "units": {
  "retail": {
   "id": "unit_retail_001",
   "name": "Penuel Express Shop",
   "type": "Retail Convenience",
   "operating_hours": "06:00-23:00",
   "categories": [
    {
     "category_id": "cat_001",
     "name": "Snacks & Beverages",
     "items": [
      {
       "id": "item_001",
       "product": "Water (500ml)",
       "price": 50,
       "stock": 250
      },
      {
       "id": "item_002",
       "product": "Energy Drink (330ml)",
       "price": 120,
       "stock": 120
      },
      {
       "id": "item_003",
       "product": "Packaged Snacks Bundle",
       "price": 200,
       "stock": 80
      }
     ]
    },
    {
     "category_id": "cat_002",
     "name": "Travel Essentials",
     "items": [
      {
       "id": "item_004",
       "product": "Phone charger (USB-C)",
       "price": 350,
       "stock": 45
      },
      {
       "id": "item_005",
       "product": "Travel pillow",
       "price": 280,
       "stock": 30
      },
      {
       "id": "item_006",
       "product": "Sunscreen SPF 50",
       "price": 400,
       "stock": 50
      }
     ]
    },
    {
     "category_id": "cat_003",
     "name": "Local Crafts & Souvenirs",
     "items": [
      {
       "id": "item_007",
       "product": "Maasai beaded bracelet",
       "price": 500,
       "stock": 35
      },
      {
       "id": "item_008",
       "product": "Wooden carving (small)",
       "price": 800,
       "stock": 20
      }
     ]
    }
   ],
   "payment_methods": [
    "Cash KES",
    "M-Pesa",
    "Credit cards",
    "Digital wallets"
   ]
  },
  "dining": {
   "id": "unit_dining_001",
   "name": "Wayfarer's Kitchen",
   "type": "Quick Service Restaurant",
   "operating_hours": "06:00-23:00",
   "seating_capacity": 80,
   "tables": [
    {
     "table_id": "table_001",
     "table_number": "1-10",
     "capacity_per_table": 4,
     "status": "available"
    },
    {
     "table_id": "table_002",
     "table_number": "11-20",
     "capacity_per_table": 2,
     "status": "available"
    }
   ],
   "menu_categories": [
    {
     "category_id": "menu_001",
     "name": "Breakfast & Light Meals",
     "items": [
      {
       "id": "menu_item_001",
       "dish": "Ugali & Sukuma Wiki",
       "price": 250,
       "prep_time_minutes": 10,
       "availability": true
      },
      {
       "id": "menu_item_002",
       "dish": "Eggs with Toast & Butter",
       "price": 180,
       "prep_time_minutes": 8,
       "availability": true
      }
     ]
    },
    {
     "category_id": "menu_002",
     "name": "Main Courses",
     "items": [
      {
       "id": "menu_item_003",
       "dish": "Grilled Chicken with Chapati",
       "price": 380,
       "prep_time_minutes": 20,
       "availability": true
      },
      {
       "id": "menu_item_004",
       "dish": "Nyama Choma (Beef) with Kachumbari",
       "price": 450,
       "prep_time_minutes": 25,
       "availability": true
      },
      {
       "id": "menu_item_005",
       "dish": "Fish & Chips Platter",
       "price": 420,
       "prep_time_minutes": 18,
       "availability": true
      }
     ]
    },
    {
     "category_id": "menu_003",
     "name": "Beverages",
     "items": [
      {
       "id": "menu_item_006",
       "drink": "Fresh Fruit Juice (500ml)",
       "price": 120,
       "prep_time_minutes": 3,
       "availability": true
      },
      {
       "id": "menu_item_007",
       "drink": "Premium Coffee",
       "price": 150,
       "prep_time_minutes": 5,
       "availability": true
      }
     ]
    }
   ],
   "payment_methods": [
    "Cash KES",
    "M-Pesa",
    "Card payment"
   ]
  },
  "automotive": {
   "id": "unit_auto_001",
   "name": "Executive Wash & Service Bay",
   "type": "Vehicle Services",
   "operating_hours": "06:00-22:00",
   "bays": [
    {
     "bay_id": "bay_001",
     "bay_number": 1,
     "type": "Wash bay",
     "status": "available"
    },
    {
     "bay_id": "bay_002",
     "bay_number": 2,
     "type": "Wash bay",
     "status": "available"
    },
    {
     "bay_id": "bay_003",
     "bay_number": 3,
     "type": "Service & maintenance",
     "status": "available"
    }
   ],
   "services": [
    {
     "service_id": "svc_001",
     "name": "Standard Car Wash",
     "duration_minutes": 15,
     "price": 500,
     "suitable_for": "All vehicles"
    },
    {
     "service_id": "svc_002",
     "name": "Executive Wash (Interior & Exterior)",
     "duration_minutes": 45,
     "price": 1200,
     "suitable_for": "Luxury vehicles"
    },
    {
     "service_id": "svc_003",
     "name": "Oil & Filter Change",
     "duration_minutes": 30,
     "price": 1500,
     "suitable_for": "All vehicles"
    },
    {
     "service_id": "svc_004",
     "name": "Tire Rotation & Alignment",
     "duration_minutes": 60,
     "price": 2000,
     "suitable_for": "All vehicles"
    },
    {
     "service_id": "svc_005",
     "name": "Battery Check & Replacement",
     "duration_minutes": 20,
     "price": 3000,
     "suitable_for": "All vehicles"
    },
    {
     "service_id": "svc_006",
     "name": "Basic Mechanical Inspection",
     "duration_minutes": 40,
     "price": 800,
     "suitable_for": "All vehicles"
    }
   ],
   "spare_parts": [
    {
     "part_id": "part_001",
     "name": "Engine Oil (5L)",
     "price": 2200,
     "stock": 15
    },
    {
     "part_id": "part_002",
     "name": "Air Filter",
     "price": 400,
     "stock": 25
    },
    {
     "part_id": "part_003",
     "name": "Brake Pads (set)",
     "price": 3500,
     "stock": 8
    }
   ],
   "waiting_lounge": {
    "seating_capacity": 25,
    "amenities": [
     "WiFi",
     "TV lounge",
     "Refreshments",
     "Restrooms"
    ]
   },
   "payment_methods": [
    "Cash KES",
    "M-Pesa",
    "Card payment",
    "Invoice (fleet accounts)"
   ]
  }
 },
 "staffing": {
  "retail": 4,
  "dining": 8,
  "automotive": 6
 }
};
