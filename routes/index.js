const express = require('express');
const router = express.Router();

const category = require('./category.routes');
const task = require('./task.routes');
const users = require('./user.routes');

router.use('/api/category', category);
router.use('/api/task', task);
router.use('/api/v1/users', users);

router.get('/', (req, res) => {
    res.json({ message: `Welcome To Task Manager Application` });
});
module.exports = router;