const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Unknown /api/... routes -> JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Production: serve the built React app (client/dist) from this same server,
// so the website and API share one URL (this is what Render runs).
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist));
  // Any other URL -> React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // Development: React runs separately on port 5173
  app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API is running. Open the app at http://localhost:5173' });
  });
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

module.exports = app;
