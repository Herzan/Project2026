const TaskModel = require('../models/taskModel');

const TaskController = {
  // GET /api/tasks
  getAllTasks(req, res) {
    res.json(TaskModel.getAll());
  },

  // POST /api/tasks
  createTask(req, res) {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const task = TaskModel.create(title);
    res.status(201).json(task);
  },

  // PUT /api/tasks/:id/toggle
  toggleTask(req, res) {
    const task = TaskModel.toggle(Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  },

  // DELETE /api/tasks/:id
  deleteTask(req, res) {
    const removed = TaskModel.remove(Number(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  }
};

module.exports = TaskController;
