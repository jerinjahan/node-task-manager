const controller = require("../controllers/sub-tasks.controller");
const router = require("express").Router();

router.get("", controller.getAllSubTasks);
router.get("/:id", controller.findOne);
router.post("", controller.addSubtask);
router.put("/:id",  controller.updateSubtask);
router.delete("/:id",  controller.deleteSubtask);

module.exports = router;