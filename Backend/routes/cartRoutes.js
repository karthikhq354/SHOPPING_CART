const express = require("express");
const router = express.Router();
const { getAll, getByUsername, sync, remove } = require("../controllers/cartController");
const { adminAuth } = require("../middleware/auth");

router.post("/sync", sync);
router.get("/user/:username", getByUsername);
router.get("/", adminAuth, getAll);
router.delete("/user/:username", adminAuth, remove);

module.exports = router;