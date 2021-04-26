const db = require("../models");
const Category = db.category;

// Create and Save a new Words
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    const category = new Category({
        name: req.body.name
    });
    // Save Words in the database
    category
        .save(category)
        .then(data => {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Words successfully created.",
                    data: data
                }
            );
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the Category."
            });
        });
};
// Update a Words by the id in the request
exports.update = (req, res) => {
    console.log(res.params);
    const id = req.params.categoryId;
    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Category with id=${id}. Maybe Tutorial was not found!`
                });
            } else res.status(200).send({ status: true, message: "Category was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Error updating Category with id=" + id
            });
        });
};
// Find a single Words with an id
exports.findOne = (req, res) => {
    const id = req.params.categoryId;
    Category.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Category with id " + id });
            else res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving Category with id=" + id });
        });
};
// Retrieve all Wordss from the database.
exports.getAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Category.find(null, { "name": true, "serialno": true })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user groups."
            });
        });
};
// Delete a Words with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.categoryId;
    Category.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
                });
            } else {
                res.send({
                    status: true,
                    message: "Category was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Could not delete Category with id=" + id
            });
        });
};
// Delete all Category from the database.
exports.deleteAll = (req, res) => {
    Category.deleteMany({})
        .then(data => {
            res.send({
                status : true,
                message: `${data.deletedCount} Category were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all categories."
            });
        });
};



// Retrieve all Category from the database with pagination.
exports.findAll = (req, res) => {
    const { currentPage, itemPerPage } = req.query;
    const { limit, offset } = getPagination(currentPage, itemPerPage);

    Category.findAndCountAll(
        {
            limit: limit,
            offset: offset,
            where: { isActive: true },
            include: [
                {
                    model: Right,
                    // as: "user_groups",
                    attributes: ["id", "name", "description"]
                },
            ]
        })
        .then(data => {
            const response = getPagingData(data, currentPage, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving roles."
            });
        });
};