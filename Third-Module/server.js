require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const { seedIfEmpty } = require('./seed/seedData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Friendly message for the root URL (the React app lives on port 5173)
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running. Open the app at http://localhost:5173' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB, add demo data if the database is empty, then listen
connectDB()
  .then(seedIfEmpty)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Task Manager API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup failed:', err.message);
    process.exit(1);
  });
