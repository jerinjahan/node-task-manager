const express = require('express');
const router = express.Router();

const category = require('./category.routes');

router.use('/api/category', category);

router.get('/', (req, res) => {
    res.json({ message: `Welcome To Task Manager Application` });
});
module.exports = router;