const cloudinary = require('cloudinary');
const asyncHandler = require("../middlewares/asyncHander");
const db = require("../models");
const Files = db.files;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_ID,
    api_secret: process.env.API_SECRET
})


// Retrieve all files from the database based on taskId.
exports.getAll = (req, res) => {
    const taskId = req.query.taskId;
    Files.find({})
        .populate('taskId',{'name':1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving files."
            });
        });
};

exports.uploadSingleFile = asyncHandler(async (req, res, next) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        let fileData = new Files({
            original_filename: result.original_filename,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            url: result.url,
            secure_url: result.secure_url,
            taskId: req.params.taskId
        });

        try {
            const data = await fileData.save();
            res.status(200).json({ success: true, message: "Files successfully created.", data: data });
        } catch (err) {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while uploading file."
            });
        }
    } catch (error) {
        res.send({
            message: error
        })
    }
});

exports.deleteFile = asyncHandler(async (req, res) => {
    try {
        // Find files by id
        let file = await Files.findById(req.params.id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(file.public_id);
        // Delete files from db
        await file.remove();
        res.status(200).json({ success: true, message: "File successfully deleted.", data: file });
    } catch (err) {
        res.status(500).json({ success: false, message: err});
    }
});