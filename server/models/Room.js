const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  tier:          { type: String, enum: ['non-luxury', 'luxury', 'vip'], required: true },
  hasAC:         { type: Boolean, default: false },
  pricePerNight: { type: Number, required: true },
  description:   { type: String },
  images:        [{ type: String }],
  amenities:     [{ type: String }],
  maxGuests:     { type: Number, default: 2 },
  isAvailable:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);