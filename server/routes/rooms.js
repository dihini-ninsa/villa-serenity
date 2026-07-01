const express = require('express');
const Room    = require('../models/Room');
const { protect, isAdmin } = require('../middleware/protect');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.tier) filter.tier  = req.query.tier;
    if (req.query.ac)   filter.hasAC = req.query.ac === 'true';
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;