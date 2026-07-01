require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

const rooms = [
  {
    name: 'Garden Room', tier: 'non-luxury', hasAC: false, pricePerNight: 50, maxGuests: 2,
    description: 'A cozy, naturally ventilated room surrounded by lush tropical gardens. Perfect for nature lovers on a budget.',
    amenities: ['WiFi', 'Fan', 'Garden View', 'Hot Shower'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
  },
  {
    name: 'Garden Room A/C', tier: 'non-luxury', hasAC: true, pricePerNight: 70, maxGuests: 2,
    description: 'Our garden room with the added comfort of air conditioning. Affordable and comfortable.',
    amenities: ['WiFi', 'A/C', 'Garden View', 'Hot Shower'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
  },
  {
    name: 'Luxury Suite', tier: 'luxury', hasAC: false, pricePerNight: 120, maxGuests: 3,
    description: 'Elegantly furnished suite with premium decor, natural ventilation, and stunning garden views.',
    amenities: ['WiFi', 'Mini Bar', 'Pool Access', 'Breakfast', 'Garden View'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
  },
  {
    name: 'Luxury Suite A/C', tier: 'luxury', hasAC: true, pricePerNight: 150, maxGuests: 3,
    description: 'Air-conditioned luxury suite with premium furnishings, pool access, and personalised service.',
    amenities: ['WiFi', 'A/C', 'Mini Bar', 'Pool Access', 'Breakfast', 'Garden View'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
  },
  {
    name: 'VIP Penthouse A/C', tier: 'vip', hasAC: true, pricePerNight: 280, maxGuests: 4,
    description: 'Our finest suite. Exclusive top-floor penthouse with panoramic views, private pool, personal butler, and every luxury.',
    amenities: ['WiFi', 'A/C', 'Private Pool', 'Butler Service', 'Breakfast & Dinner', 'Airport Transfer', 'Sea View'],
    images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
  },
  {
    name: 'VIP Garden Villa A/C', tier: 'vip', hasAC: true, pricePerNight: 320, maxGuests: 5,
    description: 'A private villa within the resort. Spacious living areas, private garden, plunge pool, and dedicated concierge.',
    amenities: ['WiFi', 'A/C', 'Private Garden', 'Plunge Pool', 'Concierge', 'Full Board', 'Spa Access'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'],
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Room.deleteMany();
    await Room.insertMany(rooms);
    console.log('✅ Rooms seeded with beautiful images!');
    process.exit();
  })
  .catch(err => { console.error(err); process.exit(1); });