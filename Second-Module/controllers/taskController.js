const TaskModel = require('../models/taskModel');

const TaskController = {
  // GET /api/tasks?search=&assignee=&status=
  getAllTasks(req, res) {
    const { search, assignee, status } = req.query;
    res.json(TaskModel.getAll({ search, assignee, status }));
  },

  // GET /api/tasks/assignees
  getAssignees(req, res) {
    res.json(TaskModel.getAssignees());
  },

  // POST /api/tasks
  createTask(req, res) {
    const { title, assignee } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const task = TaskModel.create(title, assignee);
    res.status(201).json(task);
  },

  // PUT /api/tasks/:id
  updateTask(req, res) {
    const id = Number(req.params.id);
    const { title, assignee } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const task = TaskModel.update(id, { title, assignee });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
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
