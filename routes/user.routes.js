const controller = require("../controllers/user.controller");
const router = require("express").Router();

router.get("", controller.getUsers);
router.get("/:userId", controller.findOne);
router.post("", controller.addUser);
router.put("/:userId",  controller.updateUser);
router.delete("/:userId",  controller.deleteUser);
router.delete("/", controller.deleteAll);

module.exports = router;