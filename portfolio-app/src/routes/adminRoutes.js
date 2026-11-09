const router = require("express").Router();
const controller = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.use(requireAdmin);
router.get("/", controller.dashboard);
router.get("/messages", controller.messages);
router.post("/messages/:id/read", controller.markMessageRead);
router.post("/messages/:id/delete", controller.deleteMessage);

module.exports = router;