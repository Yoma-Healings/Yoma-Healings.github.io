const router = require("express").Router();
const controller = require("../controllers/authController");

router.get("/login", controller.showLogin);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

module.exports = router;