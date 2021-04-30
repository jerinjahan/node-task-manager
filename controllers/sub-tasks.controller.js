const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");
const SubTasks = db.subTasks;

// @desc    Get all subtasks.
// @route   GET /api/subtasks.
// @access  Private
exports.getAllSubTasks = asyncHandler(async (req, res, next) => {
    try {
        var Subtasks = await SubTasks.find({}).select('name').select('status').sort({_id:1});
        // Return the Subtasks list with the appropriate HTTP password Code and Message.
        return res.status(200).json(Subtasks);
        // return res.status(200).json({ status: 200, data: Subtasks, message: "Succesfully Subtasks Recieved" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(500).json({ status: 500, message: e.message });
    }
});

// @desc    Get subTask by id
// @route   GET /api/subtasks./:id
// @access  Private
exports.findOne = asyncHandler(async (req, res, next) => {
    try {
        const subTask = await SubTasks.findById(req.params.subTaskId);
        if (!subTask) {
            return next(
                new ErrorResponse(`No such subTask with id ${req.params.subTaskId}`, 404)
            );
        }
        res.status(200).json({ success: true, data: subTask });
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
});

// @desc    Add a subTask
// @route   POST /api/subtasks.
// @access  Private
exports.addSubtask = asyncHandler(async (req, res, next) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    // Save Subtasks in the database
    try{
        const subTask = await SubTasks.insertMany(req.body);
        res.status(200).json({ success: true, data: subTask,message: "Subtask successfully created.", });
    }catch(err){
        res.status(500).send({
            status: false,
            httpStatusCode: 500,
            message:
                err.message || "Some error occurred while creating the SubTasks."
        });
    }
});

// @desc    Update subTask by id
// @route   PUT /api/subtasks./:id
// @access  Private
exports.updateSubtask = asyncHandler(async (req, res, next) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    try{
        const subTask = await SubTasks.findByIdAndUpdate(req.params.subTaskId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!subTask) {
            return next(
                new ErrorResponse(`No such subTask with id ${req.params.subTaskId}`, 404)
            );
        }
        res.status(200).json({ success: true, data: subTask,message: "Subtask was updated successfully." });
    }catch(err){
        res.status(500).send({
            status: false,
            httpStatusCode: 500,
            message:
                err.message || `Error updating Subtask with id= ${req.params.subTaskId}`
        });
    }
});

// @desc    Deletes subTask by id
// @route   DELETE /api/subtasks./:id
// @access  Private
exports.deleteSubtask = asyncHandler(async (req, res, next) => {
    const subTask = await SubTasks.findById(req.params.subTaskId);
    if (!subTask) {
        return next(
            new ErrorResponse(`No such subTask with id ${req.params.subTaskId}`, 404)
        );
    }
    try{
        await SubTasks.findByIdAndDelete(req.params.subTaskId);
        res.status(200).json({ success: true, message: "Subtask was deleted successfully!" });
    }catch(err){
        res.status(500).send({
            status: false,
            message: err.message || "Could not delete Subtask with id=" + id
        });
    }
});