const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error('\nMongoDB connection error:', err.message);
    console.error('-> Make sure MongoDB is running, or set MONGO_URI in your .env file.\n');
    // Exit so the failure is obvious instead of silently running with no DB
    process.exit(1);
  }
}

module.exports = connectDB;
