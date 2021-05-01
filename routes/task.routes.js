const controller = require("../controllers/task.controller");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/:taskId", controller.findOne);
router.post("", controller.create);
router.put("/:taskId",  controller.addNewTask);
router.put("/addNewTask/:taskId",  controller.addNewTask);
router.delete("/:taskId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;