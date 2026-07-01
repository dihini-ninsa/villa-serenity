const express = require('express');
const Booking = require('../models/Booking');
const Room    = require('../models/Room');
const { protect, isAdmin } = require('../middleware/protect');
const router  = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const conflict = await Booking.findOne({
      room: roomId,
      status: { $ne: 'cancelled' },
      $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }]
    });
    if (conflict) return res.status(400).json({ message: 'Room not available for those dates' });

    const nights     = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      user: req.user.id, room: roomId, checkIn, checkOut, guests, totalPrice
    });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'name tier pricePerNight images');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', protect, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name tier pricePerNight')
      .populate('user', 'fullName email');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH confirm booking (admin only)
router.patch('/:id/confirm', protect, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'confirmed';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;