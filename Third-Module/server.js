require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { seedIfEmpty } = require('./seed/seedData');

const PORT = process.env.PORT || 3000;

// In production the login secret must be set explicitly
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it in your environment variables.');
  process.exit(1);
}

// Connect to MongoDB, add demo data if the database is empty, then listen
connectDB()
  .then(() => (process.env.SEED_DEMO_DATA === 'false' ? null : seedIfEmpty()))
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Task Manager running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup failed:', err.message);
    process.exit(1);
  });
