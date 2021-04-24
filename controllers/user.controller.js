const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res, next) => {
    try {
        var Users = await User.find();
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json(Users);
        // return res.status(200).json({ status: 200, data: Users, message: "Succesfully Users Recieved" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(500).json({ status: 500, message: e.message });
    }
});

// @desc    Get user by id
// @route   GET /api/v1/users/:id
// @access  Private
exports.findOne = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(
                new ErrorResponse(`No such user with id ${req.params.userId}`, 404)
            );
        }
        res.status(200).json({ success: true, data: user });
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
});

// @desc    Add a user
// @route   POST /api/v1/users
// @access  Private
exports.addUser = asyncHandler(async (req, res, next) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }
    // Save Users in the database
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    try{
        const user = await User.create(req.body);
        res.status(200).json({ success: true, data: user,message: "User successfully created.", });
    }catch(err){
        res.status(500).send({
            status: false,
            httpStatusCode: 500,
            message:
                err.message || "Some error occurred while creating the User."
        });
    }
});

// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
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
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return next(
                new ErrorResponse(`No such user with id ${req.params.userId}`, 404)
            );
        }
        res.status(200).json({ success: true, data: user,message: "User was updated successfully." });
    }catch(err){
        res.status(500).send({
            status: false,
            httpStatusCode: 500,
            message:
                err.message || `Error updating User with id= ${req.params.userId}`
        });
    }
});

// @desc    Deletes user by id
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return next(
            new ErrorResponse(`No such user with id ${req.params.userId}`, 404)
        );
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ success: true, message: "User was deleted successfully!" });
    }catch(err){
        res.status(500).send({
            status: false,
            message: err.message || "Could not delete User with id=" + id
        });
    }
});









// Create and Save a new Users
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
    // Save Users in the database
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.create(req.body)
        .then(data => {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "User successfully created.",
                    data: data
                }
            );
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};
// Update a Users by the id in the request
exports.update = (req, res) => {
    const id = req.params.userId;
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update User with id=${id}. Maybe Tutorial was not found!`
                });
            } else res.status(200).send({ status: true, message: "User was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Error updating User with id=" + id
            });
        });
};
// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.userId;
    User.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            } else {
                res.send({
                    status: true,
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Could not delete User with id=" + id
            });
        });
};
// Delete all User from the database.
exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                status: true,
                message: `${data.deletedCount} User were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all categories."
            });
        });
};



exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                return res.status(404).send({ message: "Username or password wrong!" });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            let tokenGeneartionData = {
                id: user._id,
                username: user.username,
                email: user.email
            }
            var token = jwt.sign(tokenGeneartionData, config.secret, {
                algorithm: "HS512",
                // expiresIn: process.env.ACCESS_TOKEN_LIFE
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                token: token
            });
        });
};