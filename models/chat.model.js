const mongoose = require("mongoose");

const Chat = mongoose.model("Chat",
    new mongoose.Schema({
        task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        message: String,
        sent_time: String,
        sent_from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sent_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: Number,

        name: String,
    },
        {
            toJSON: { virtuals: true },
            toObject: { virtuals: true }
        }
    )
);

module.exports = Chat;