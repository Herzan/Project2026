// Data layer: in-memory store for tasks
let tasks = [];
let nextId = 1;

const TaskModel = {
  getAll() {
    return tasks;
  },

  findById(id) {
    return tasks.find(t => t.id === id);
  },

  create(title) {
    const task = { id: nextId++, title: title.trim(), done: false };
    tasks.push(task);
    return task;
  },

  toggle(id) {
    const task = this.findById(id);
    if (!task) return null;
    task.done = !task.done;
    return task;
  },

  remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }
};

module.exports = TaskModel;
