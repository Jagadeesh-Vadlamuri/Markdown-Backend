const express = require('express');
const router = express.Router();
const {getTasks, getTask, createTask, updateTask, deleteTask} = require('../controllers/tasks');

router.route('/getTasks').get(getTasks);
router.route('/getTask/:id').get(getTask);
router.route('/createTask').post(createTask);
router.route('/updateTask/:id').put(updateTask);
router.route('/deleteTask/:id').delete(deleteTask);


module.exports = router