
const mongoose = require("mongoose");

const db = require("../models");
const Category = db.category;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MongoDB connected.");
        initial();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;


function initial() {
    Category.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Category({
                name: "Personal care"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'Personal care' to roles collection");
            });

            new Category({
                name: "House chores"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'House chores' to roles collection");
            });

            new Category({
                name: "Shopping"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Shopping' to roles collection");
            });
        }
    });
}