const express = require("express");
const router = express.Router();
const { getAll, getByUsername, create, updateStatus, remove } = require("../controllers/orderController");
const { adminAuth } = require("../middleware/auth");

router.post("/",                   create);
router.get("/user/:username",      getByUsername);
router.get("/",                    adminAuth, getAll);
router.put("/:id/status",         adminAuth, updateStatus);
router.delete("/:id",              adminAuth, remove);

module.exports = router;