const controller = require("../controllers/task.controller");
const { checkDuplicate } = require("../middlewares");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/:taskId", controller.findOne);
router.post("", controller.create);
router.put("/:taskId",  controller.update);
router.delete("/:taskId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;