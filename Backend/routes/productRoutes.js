const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/productController");
const { adminAuth } = require("../middleware/auth");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", adminAuth, create);
router.put("/:id", adminAuth, update);
router.delete("/:id", adminAuth, remove);

module.exports = router;