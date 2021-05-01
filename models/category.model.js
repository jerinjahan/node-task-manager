const mongoose = require("mongoose");

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        name: String
    },{ toJSON: { virtuals: true }, toObject: { virtuals: true } })
);

module.exports = Category;
