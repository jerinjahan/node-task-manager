const controller = require("../controllers/user.controller");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/:userId", controller.findOne);
router.post("", controller.create);
router.put("/:userId",  controller.update);
router.delete("/:userId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;