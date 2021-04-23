const controller = require("../controllers/category.controller");
const { checkDuplicate } = require("../middlewares");
const router = require("express").Router();

router.get("", controller.getAll);
router.get("/:categoryId", controller.findOne);
router.post("", controller.create);
router.put("/:categoryId",  controller.update);
router.delete("/:categoryId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;