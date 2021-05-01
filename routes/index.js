//#region for upload
const uploadController = require("../controllers/upload.controller");
const upload = require('../utils/multer');
//#endregion

const controller = require("../controllers/user.controller");
const express = require('express');
const router = express.Router();

const users = require('./user.routes');
const category = require('./category.routes');
const task = require('./task.routes');
const subTasks = require('./sub-tasks.routes');

router.use('/api/signin', controller.signin);
router.use('/api/v1/users', users);
router.use('/api/category', category);
router.use('/api/task', task);
router.use('/api/subTasks', subTasks);

router.post('/api/upload/:taskId', upload.single('image'), uploadController.uploadSingleFile);
router.delete('/api/upload/:id', uploadController.deleteFile);
router.get('/api/upload/:taskId', uploadController.getAll);


router.get('/', (req, res) => {
    res.json({ message: `Welcome To Task Manager Application` });
});
module.exports = router;