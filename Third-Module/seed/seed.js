// Wipes users + tasks and reloads the sample data.
// Run with:  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const { users, tasks, resetAndSeed } = require('./seedData');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to ${mongoose.connection.name}`);

  await resetAndSeed();

  console.log(`Seeded ${users.length} users and ${tasks.length} tasks.\n`);
  console.log('Login with any of these:');
  users.forEach((u) => console.log(`  username: ${u.username.padEnd(7)} password: ${u.password}`));

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
