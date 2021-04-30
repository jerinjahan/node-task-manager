const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const config = require("../config/auth.config");

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_ID,
    api_secret: process.env.API_SECRET
})
exports.uploadSingleFile = asyncHandler(async (req, res, next) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path)
        res.send({
            message: result
        })
    } catch (error) {
        res.send({
            message: error
        })
    }
});