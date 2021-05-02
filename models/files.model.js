const mongoose = require("mongoose");

const Files = mongoose.model(
    "Files",
    new mongoose.Schema({
        name: String,
        public_id: String,
        width: String,
        height: String,
        format: String,
        resource_type: String,
        bytes: String,
        url: String,
        thumbUrl: String,
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    },{ toJSON: { virtuals: true }, toObject: { virtuals: true } })
);

module.exports = Files;
