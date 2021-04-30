const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.category = require("./category.model");
db.user = require("./user.model");
db.task = require("./task.model");
db.subTasks = require("./sub-task.model");

module.exports = db;