const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const User = require("../models/user.model");

const router = express.Router();

const {
    addUser,
    updateUser,
    getUser,
    getUsers,
    deleteUser,
} = require("../controllers/user.controller");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(filterSortSelectPage(User, "shops"), getUsers).post(addUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);


const controller = require("../controllers/user.controller");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/:userId", controller.findOne);
router.post("", controller.addUser);
router.put("/:userId",  controller.update);
router.delete("/:userId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;
