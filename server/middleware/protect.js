const jwt  = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorised' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id === 'admin-hardcoded') {
      req.user = { id: 'admin-hardcoded', role: 'admin', fullName: 'Admin' };
    } else {
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access only' });
  next();
};