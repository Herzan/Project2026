const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(user) {
  return jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
}

// Protects routes: requires "Authorization: Bearer <token>"
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Please log in' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Please log in again' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired, please log in again' });
  }
}

module.exports = { requireAuth, signToken };
