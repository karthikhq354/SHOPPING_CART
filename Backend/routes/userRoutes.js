const express = require("express");
const router = express.Router();
const { getAll, getById, remove, upsert } = require("../controllers/userController");
const { adminAuth } = require("../middleware/auth");

router.post("/sync", upsert);
router.get("/", adminAuth, getAll);
router.get("/:id", adminAuth, getById);
router.delete("/:id", adminAuth, remove);

module.exports = router;