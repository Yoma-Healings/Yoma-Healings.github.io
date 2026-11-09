const router = require("express").Router();
const controller = require("../controllers/adminController");
const projects = require("../controllers/projectAdminController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.use(requireAdmin);
router.get("/", controller.dashboard);
router.get("/messages", controller.messages);
router.post("/messages/:id/read", controller.markMessageRead);
router.post("/messages/:id/delete", controller.deleteMessage);
router.get("/projects", projects.list);
router.get("/projects/new", projects.newForm);
router.post("/projects", projects.create);
router.get("/projects/:id/edit", projects.editForm);
router.post("/projects/:id", projects.update);
router.post("/projects/:id/delete", projects.remove);

module.exports = router;