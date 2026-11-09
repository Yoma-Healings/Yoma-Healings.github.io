const router = require("express").Router();
const { createMessage } = require("../controllers/contactController");

router.post("/", createMessage);

module.exports = router;