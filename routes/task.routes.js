const controller = require("../controllers/task.controller");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/assignedToMe/:userId", controller.getAllAssignedToMe);
router.get("/assignedByMe/:userId", controller.getAllAssignedByMe);
router.get("/:taskId", controller.findOne);
router.post("", controller.create);
router.put("/:taskId",  controller.update);
router.put("/addNewTask/:taskId",  controller.addNewTask);
router.delete("/:taskId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;