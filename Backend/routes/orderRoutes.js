const express = require("express");
const router = express.Router();
const { getAll, getByUsername, create, updateStatus } = require("../controllers/orderController");
const { adminAuth } = require("../middleware/auth");

router.post("/", create);
router.get("/", adminAuth, getAll);
router.get("/user/:username", getByUsername);
router.put("/:id/status", adminAuth, updateStatus);

module.exports = router;