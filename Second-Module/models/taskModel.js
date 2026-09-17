// Data layer: in-memory store for tasks
let tasks = [];
let nextId = 1;

function seed() {
  const samples = [
    { title: 'Design database schema', assignee: 'alice', done: true },
    { title: 'Build REST API endpoints', assignee: 'bob', done: false },
    { title: 'Write unit tests', assignee: 'alice', done: false },
    { title: 'Set up CI pipeline', assignee: 'carol', done: false },
    { title: 'Review pull requests', assignee: 'bob', done: true }
  ];
  samples.forEach(s => {
    const now = new Date().toISOString();
    tasks.push({
      id: nextId++,
      title: s.title,
      assignee: s.assignee,
      done: s.done,
      createdAt: now,
      updatedAt: now
    });
  });
}
seed();

const TaskModel = {
  // Returns all tasks, optionally filtered by search text, assignee, and status
  getAll({ search, assignee, status } = {}) {
    let result = tasks;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.assignee || '').toLowerCase().includes(q)
      );
    }

    if (assignee && assignee.trim()) {
      const a = assignee.trim().toLowerCase();
      result = result.filter(t => (t.assignee || '').toLowerCase() === a);
    }

    if (status === 'active') {
      result = result.filter(t => !t.done);
    } else if (status === 'completed') {
      result = result.filter(t => t.done);
    }

    // Most recently created first
    return [...result].sort((a, b) => b.id - a.id);
  },

  findById(id) {
    return tasks.find(t => t.id === id);
  },

  create(title, assignee) {
    const now = new Date().toISOString();
    const task = {
      id: nextId++,
      title: title.trim(),
      assignee: assignee && assignee.trim() ? assignee.trim() : 'Unassigned',
      done: false,
      createdAt: now,
      updatedAt: now
    };
    tasks.push(task);
    return task;
  },

  update(id, { title, assignee } = {}) {
    const task = this.findById(id);
    if (!task) return null;
    if (typeof title === 'string' && title.trim()) task.title = title.trim();
    if (typeof assignee === 'string') {
      task.assignee = assignee.trim() ? assignee.trim() : 'Unassigned';
    }
    task.updatedAt = new Date().toISOString();
    return task;
  },

  toggle(id) {
    const task = this.findById(id);
    if (!task) return null;
    task.done = !task.done;
    task.updatedAt = new Date().toISOString();
    return task;
  },

  remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },

  // Unique list of assignees currently in use, for filter dropdowns / autocomplete
  getAssignees() {
    const set = new Set(tasks.map(t => t.assignee).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }
};

module.exports = TaskModel;
