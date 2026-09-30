const User = require('../models/User');
const Task = require('../models/Task');

const users = [
  { username: 'admin',  name: 'Admin',       password: 'admin123' },
  { username: 'maria',  name: 'Maria Lopez', password: 'maria123' },
  { username: 'carlos', name: 'Carlos Ruiz', password: 'carlos123' },
  { username: 'ana',    name: 'Ana Torres',  password: 'ana123' }
];

const tasks = [
  { title: 'Set up the project repository',       assignee: 'admin',      done: true },
  { title: 'Design the database schema',          assignee: 'carlos',     done: true },
  { title: 'Build the login page',                assignee: 'maria',      done: true },
  { title: 'Add search and filters to task list', assignee: 'maria',      done: false },
  { title: 'Write API documentation',             assignee: 'ana',        done: false },
  { title: 'Test edit and delete features',       assignee: 'carlos',     done: false },
  { title: 'Review pull requests',                assignee: 'admin',      done: false },
  { title: 'Prepare the final demo video',        assignee: 'ana',        done: false },
  { title: 'Decide who will present on Friday',   assignee: 'Unassigned', done: false }
];

// create() one by one so the password-hashing hook runs
async function createUsers() {
  for (const u of users) await User.create(u);
}

// Used by "npm run seed": wipes everything and reloads the sample data
async function resetAndSeed() {
  await Promise.all([User.deleteMany({}), Task.deleteMany({})]);
  await createUsers();
  await Task.insertMany(tasks);
}

// Used automatically when the server starts: only fills what is empty,
// so login works on the very first run and real data is never deleted.
async function seedIfEmpty() {
  if ((await User.countDocuments()) === 0) {
    await createUsers();
    console.log('No users found -> created demo users (admin / admin123)');
  }
  if ((await Task.countDocuments()) === 0) {
    await Task.insertMany(tasks);
    console.log('No tasks found -> created demo tasks');
  }
}

module.exports = { users, tasks, resetAndSeed, seedIfEmpty };
