const express = require("express");
const router = express.Router();
const { login, dashboard } = require("../controllers/adminController");
const { adminAuth } = require("../middleware/auth");

router.post("/login", login);
router.get("/dashboard", adminAuth, dashboard);

module.exports = router;