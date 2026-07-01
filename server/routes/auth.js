const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const ADMIN_EMAIL = 'admin@villa.com';
const ADMIN_PASSWORD = 'Admin@1234';

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ====================== REGISTER ======================
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, nic, password } = req.body;

    if (!fullName || !email || !phone || !nic || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });

    const user  = await User.create({ fullName, email, phone, nic, password });
    const token = signToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================== LOGIN ======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = signToken('admin-hardcoded', 'admin');
      return res.json({
        token,
        user: {
          id: 'admin-hardcoded',
          fullName: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        }
      });
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        nic: user.nic,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;