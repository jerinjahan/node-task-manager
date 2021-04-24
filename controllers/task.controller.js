const db = require("../models");
const Task = db.task;

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
    // Save task in the database
    Task.create(req.body)
        .then(data => {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Task successfully created.",
                    data: data
                }
            );
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the Task."
            });
        });
};
// Update a Words by the id in the request
exports.update = (req, res) => {
    const id = req.params.taskId;
    Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
                });
            } else res.status(200).send({ status: true, message: "Task was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Error updating Task with id=" + id
            });
        });
};
// Find a single Words with an id
exports.findOne = (req, res) => {
    const id = req.params.taskId;
    Task.findById(id)
        .populate('category')
        .populate('assignedBy')
        .populate('assignedTo')
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Task with id " + id });
            else res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving Task with id=" + id });
        });
};
// Retrieve all Wordss from the database.
exports.getAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Task.find()
        .populate('category')
        .populate('assignedBy')
        .populate('assignedTo')
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
    const id = req.params.taskId;
    Task.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
                });
            } else {
                res.send({
                    status: true,
                    message: "Task was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Could not delete Task with id=" + id
            });
        });
};
// Delete all Task from the database.
exports.deleteAll = (req, res) => {
    Task.deleteMany({})
        .then(data => {
            res.send({
                status : true,
                message: `${data.deletedCount} Task were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all categories."
            });
        });
};



// Retrieve all Wordss from the database with pagination.
exports.findAll = (req, res) => {
    const { currentPage, itemPerPage } = req.query;
    const { limit, offset } = getPagination(currentPage, itemPerPage);

    Task.findAndCountAll(
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