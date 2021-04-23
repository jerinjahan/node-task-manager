const mongoose = require("mongoose");

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        name: String
    })
);

module.exports = Category;


// module.exports = mongoose => {
//     var schema = mongoose.Schema(
//         {
//             name: String,
//         },
//         { timestamps: true }
//     );

//     schema.method("toJSON", function() {
//         const { __v, _id, ...object } = this.toObject();
//         object.id = _id;
//         return object;
//     });

//     const Category = mongoose.model("category", schema);
//     return Category;
// };
