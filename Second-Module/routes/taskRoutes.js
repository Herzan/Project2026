const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Note: /assignees must be declared before /:id routes so it isn't
// swallowed by the ':id' param matcher.
router.get('/assignees', TaskController.getAssignees);

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.put('/:id/toggle', TaskController.toggleTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
