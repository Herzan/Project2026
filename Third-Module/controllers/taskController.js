const Task = require('../models/Task');

// Builds a Mongo filter object from the same query params the old
// in-memory version supported: search, assignee, status
function buildFilter({ search, assignee, status } = {}) {
  const filter = {};

  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { assignee: { $regex: q, $options: 'i' } }
    ];
  }

  if (assignee && assignee.trim()) {
    filter.assignee = { $regex: `^${assignee.trim()}$`, $options: 'i' };
  }

  if (status === 'active') filter.done = false;
  if (status === 'completed') filter.done = true;

  return filter;
}

const TaskController = {
  // GET /api/tasks?search=&assignee=&status=
  async getAllTasks(req, res) {
    try {
      const filter = buildFilter(req.query);
      const tasks = await Task.find(filter).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // GET /api/tasks/assignees
  async getAssignees(req, res) {
    try {
      const names = await Task.distinct('assignee');
      res.json(names.filter(Boolean).sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch assignees' });
    }
  },

  // POST /api/tasks
  async createTask(req, res) {
    try {
      const { title, assignee } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const task = await Task.create({
        title: title.trim(),
        assignee: assignee && assignee.trim() ? assignee.trim() : 'Unassigned'
      });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // PUT /api/tasks/:id
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, assignee } = req.body;

      if (title !== undefined && !title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }

      const update = {};
      if (typeof title === 'string' && title.trim()) update.title = title.trim();
      if (typeof assignee === 'string') {
        update.assignee = assignee.trim() ? assignee.trim() : 'Unassigned';
      }

      const task = await Task.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true
      });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // PUT /api/tasks/:id/toggle
  async toggleTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      task.done = !task.done;
      await task.save();
      res.json(task);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // DELETE /api/tasks/:id
  async deleteTask(req, res) {
    try {
      const removed = await Task.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
};

module.exports = TaskController;
