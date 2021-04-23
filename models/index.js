const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.category = require("./category.model");
db.task = require("./task.model");
db.user = require("./user.model");

module.exports = db;