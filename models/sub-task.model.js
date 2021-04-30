const mongoose = require("mongoose");

const SubTask = mongoose.model(
    "SubTask",
    new mongoose.Schema({
        name: String,
        status: {
            type: Boolean,
            default: true
        }
    },{ toJSON: { virtuals: true }, toObject: { virtuals: true } })
);

module.exports = SubTask;
