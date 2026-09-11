const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.put('/:id/toggle', TaskController.toggleTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
