const router = require("express").Router();
const { index } = require("../controllers/homeController");

router.get("/", index);

module.exports = router;