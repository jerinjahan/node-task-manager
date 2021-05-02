const asyncHandler = require("../middlewares/asyncHander");
const subTaskController = require("./sub-tasks.controller");
const ObjectId = require("mongodb").ObjectID;
const db = require("../models");
const Task = db.task;
const SubTasks = db.subTasks;

// Create and Save a new Tasks
exports.createOld = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    // Save subTask in the database
    let subTasksIds = [];
    if (req.body.subTasks.length > 0) {
        try {
            subTasksIds = await SubTasks.insertMany(req.body.subTasks);
            req.body.subTasks = subTasksIds;
            // Save task in the database
            try {
                const task = await Task.create(req.body);
                res.send(
                    {
                        status: true,
                        httpStatusCode: 201,
                        message: "Task successfully created.",
                        data: task
                    }
                );
            } catch (err2) {
                res.status(500).send({
                    status: false,
                    httpStatusCode: 500,
                    message:
                        err2.message || "Some error occurred while creating the Task."
                });
            }
        } catch (err) {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the SubTasks."
            });
        }
    } else {
        try {
            const task = await Task.create(req.body);
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Task successfully created.",
                    data: task
                }
            );
        } catch (err) {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the Task."
            });
        }
    }
};
// Update a Tasks by the id in the request
exports.updateOld = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }

    const id = req.params.taskId;
    let subTasksIds = [];
    if (req.body.subTasks.length > 0) {
        try {
            subTasksIds = await SubTasks.insertMany(req.body.subTasks);
            req.body.subTasks = subTasksIds;
            // Update task in the database
            try {
                const data = await Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
                if (!data) {
                    res.status(404).send({
                        status: false,
                        message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
                    });
                } else res.status(200).send({ status: true, message: "Task was updated successfully." });

            } catch (err2) {
                res.status(500).send({
                    status: false,
                    message: err2.message || "Error updating Task with id=" + id
                });
            }
        } catch (err) {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the SubTasks."
            });
        }
    } else {
        try {
            const data = await Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
                });
            } else res.status(200).send({ status: true, message: "Task was updated successfully." });

        } catch (err) {
            res.status(500).send({
                status: false,
                message: err.message || "Error updating Task with id=" + id
            });
        }
    }



    // Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    //     .then(data => {
    //         if (!data) {
    //             res.status(404).send({
    //                 status: false,
    //                 message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
    //             });
    //         } else res.status(200).send({ status: true, message: "Task was updated successfully." });
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             status: false,
    //             message: "Error updating Task with id=" + id
    //         });
    //     });
};
exports.create = async (req, res) => {
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
    try {
        const task = await Task.create(req.body);
        if (req.body.subTasks.length > 0) {
            const allSubTask = req.body.subTasks;
            for (let i = 0; i < allSubTask.length; i++) {
                Object.assign(allSubTask[i], { taskId: task._id });
            }
            try {
                let subTasksIds = await SubTasks.insertMany(allSubTask);
                Object.assign(task, { subTasks: subTasksIds });
                res.status(200).send({
                    status: true,
                    httpStatusCode: 200,
                    message: "Task successfully created.",
                    data: task
                });
            } catch (error) {
                res.status(500).send({
                    status: false,
                    httpStatusCode: 500,
                    message: error.message || "Some error occurred while creating the sub tasks."
                });
            }
        } else {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Task successfully created.",
                    data: task
                }
            );
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            httpStatusCode: 500,
            message:
                err.message || "Some error occurred while creating the Task."
        });
    }
};
// Update a Tasks by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    const id = req.params.taskId;
    try {
        const data = await Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if (!data) {
            res.status(404).send({
                status: false,
                message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
            });
        } else res.status(200).send({ status: true, message: "Task was updated successfully." });

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message || "Error updating Task with id=" + id
        });
    }
};
// Find a single Tasks with an id
exports.findOne = async (req, res) => {
    const id = req.params.taskId;
    try {
        let task = await Task.findById(id)
            .populate('category', { 'name': 1 })
            .populate('assignedBy', { 'username': 1 })
            .populate('assignedTo', { 'username': 1 })
            .select({ "name": 1, "description": 1, "dueDate": 1, "reminderDate": 1, "status": 1 });
        const subTasks = await SubTasks.find({ taskId: new ObjectId(task._id) });
        let data = {
            _id : task._id,
            id : task._id,
            name : task.name,
            category : task.category,
            description : task.description,
            dueDate : task.dueDate,
            reminderDate : task.reminderDate,
            status : task.status,
            assignedBy : task.assignedBy,
            assignedTo : task.assignedTo,
            subTasks : subTasks
        };
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error retrieving Task with id=" + id });
    }
};
// Retrieve all Tasks from the database.
exports.getAll = async (req, res) => {
    try {
        let tasks = await Task.find({})
            .populate('category', { 'name': 1 })
            .populate('assignedBy', { 'username': 1 })
            .populate('assignedTo', { 'username': 1 })
            .select({ "name": 1, "description": 1, "dueDate": 1, "reminderDate": 1, "status": 1 });
        let data = [];
        for (const task of tasks) {
            const subTasks = await SubTasks.find({ taskId: new ObjectId(task._id) });
            data.push({
                _id : task._id,
                id : task._id,
                name : task.name,
                category : task.category,
                description : task.description,
                dueDate : task.dueDate,
                reminderDate : task.reminderDate,
                status : task.status,
                assignedBy : task.assignedBy,
                assignedTo : task.assignedTo,
                subTasks : subTasks
            });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tasks."
        });
    }
};
// Retrieve all assigned to me Tasks from the database.
exports.getAllAssignedToMe = async (req, res) => {
    const id = req.params.userId;
    try {
        let tasks = await Task.find({ assignedTo: new ObjectId(id) })
            .populate('category', { 'name': 1 })
            .populate('assignedBy', { 'username': 1 })
            .populate('assignedTo', { 'username': 1 })
            .select({ "name": 1, "description": 1, "dueDate": 1, "reminderDate": 1, "status": 1 });
        let data = [];
        for (const task of tasks) {
            const subTasks = await SubTasks.find({ taskId: new ObjectId(task._id) });
            data.push({
                _id : task._id,
                id : task._id,
                name : task.name,
                category : task.category,
                description : task.description,
                dueDate : task.dueDate,
                reminderDate : task.reminderDate,
                status : task.status,
                assignedBy : task.assignedBy,
                assignedTo : task.assignedTo,
                subTasks : subTasks
            });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tasks."
        });
    }
};
// Retrieve all assigned by me Tasks from the database.
exports.getAllAssignedByMe = async (req, res) => {
    const id = req.params.userId;
    try {
        let tasks = await Task.find({ assignedTo: new ObjectId(id) })
            .populate('category', { 'name': 1 })
            .populate('assignedBy', { 'username': 1 })
            .populate('assignedTo', { 'username': 1 })
            .select({ "name": 1, "description": 1, "dueDate": 1, "reminderDate": 1, "status": 1 });
        let data = [];
        for (const task of tasks) {
            const subTasks = await SubTasks.find({ taskId: new ObjectId(task._id) });
            data.push({
                _id : task._id,
                id : task._id,
                name : task.name,
                category : task.category,
                description : task.description,
                dueDate : task.dueDate,
                reminderDate : task.reminderDate,
                status : task.status,
                assignedBy : task.assignedBy,
                assignedTo : task.assignedTo,
                subTasks : subTasks
            });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tasks."
        });
    }
};
// Delete a Tasks with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.taskId;
    try {
        // Find task by id
        let task = await Task.findById(id);
        // Delete all sub tasks from table
        await SubTasks.deleteMany({ taskId: new ObjectId(task._id) });
        // Delete files from db
        await task.remove();
        res.status(200).json({ success: true, message: "Task was deleted successfully!", data: task });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message || "Could not delete Task with id=" + id
        });
    }
};
// Delete all Task from the database.
exports.deleteAll = (req, res) => {
    Task.deleteMany({})
        .then(data => {
            res.send({
                status: true,
                message: `${data.deletedCount} Task were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all categories."
            });
        });
};

// Add new subtasks a Tasks by the id in the request
exports.addNewTask = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    const id = req.params.taskId;
    if (req.body.subTasks.length > 0) {
        try {
            let subTasksIds = await SubTasks.insertMany(req.body.subTasks);
            let preData = await Task.findById(id).populate('subTasks');
            let subTasks = preData.subTasks.concat(subTasksIds);
            let fieldToUpdate = {
                subTasks: subTasks
            };
            // Update task in the database
            try {
                const data = await Task.findByIdAndUpdate(id, { $set: { ...fieldToUpdate } }, { useFindAndModify: false });
                // const data = await User.findByIdAndUpdate(id, { $set: { ...fieldToUpdate } }, {runValidators: true,new: true});
                if (!data) {
                    res.status(404).send({
                        status: false,
                        message: `Cannot update Task with id=${id}. Maybe Tutorial was not found!`
                    });
                } else res.status(200).send({ status: true, message: "Task was updated successfully.", data: subTasksIds });

            } catch (error) {
                res.status(500).send({
                    status: false,
                    message: error.message || "Error updating Task with id=" + id
                });
            }
        } catch (err) {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the SubTasks."
            });
        }
    }
};

// Retrieve all Taskss from the database with pagination.
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

async function findSubTasks(files) {
    const promises = files.map((file) => fs.readFile(file, 'utf8'))
    const contents = await Promise.all(promises)
    contents.forEach(console.log);
}