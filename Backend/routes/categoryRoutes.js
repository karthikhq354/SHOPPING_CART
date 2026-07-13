const express = require("express");
const router = express.Router();
const { getAll, create, update, remove } = require("../controllers/categoryController");
const { adminAuth } = require("../middleware/auth");

router.get("/", getAll);
router.post("/", adminAuth, create);
router.put("/:id", adminAuth, update);
router.delete("/:id", adminAuth, remove);

module.exports = router;