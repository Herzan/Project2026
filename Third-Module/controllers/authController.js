const User = require('../models/User');
const { signToken } = require('../middleware/auth');

const AuthController = {
  // POST /api/auth/register  { username, name, password }
  async register(req, res) {
    try {
      const { username, name, password } = req.body;
      if (!username || !username.trim()) {
        return res.status(400).json({ error: 'Username is required' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const exists = await User.findOne({ username: username.trim().toLowerCase() });
      if (exists) return res.status(409).json({ error: 'That username is already taken' });

      const user = await User.create({
        username,
        name: name && name.trim() ? name.trim() : username.trim(),
        password
      });
      res.status(201).json({ token: signToken(user), user });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const first = Object.values(err.errors)[0];
        return res.status(400).json({ error: first.message });
      }
      res.status(500).json({ error: 'Failed to register' });
    }
  },

  // POST /api/auth/login  { username, password }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+password');
      const ok = user && (await user.comparePassword(password));
      if (!ok) return res.status(401).json({ error: 'Wrong username or password' });

      res.json({ token: signToken(user), user });
    } catch (err) {
      res.status(500).json({ error: 'Failed to log in' });
    }
  },

  // GET /api/auth/me
  me(req, res) {
    res.json(req.user);
  },

  // GET /api/auth/users  -> everyone that tasks can be assigned to
  async listUsers(req, res) {
    try {
      const users = await User.find().sort({ username: 1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
};

module.exports = AuthController;
