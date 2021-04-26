const mongoose = require("mongoose");

const Task = mongoose.model(
    "Task",
    new mongoose.Schema({
        name: String,
        categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        description: String,
        dueDate: Date,
        reminderDate: Date,
        status: Number,
        assignedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    { timestamps: true },
    // { 
    //     toJSON: { virtuals: true }, 
    //     toObject: { virtuals: true } 
    // }
    )
);

module.exports = Task;