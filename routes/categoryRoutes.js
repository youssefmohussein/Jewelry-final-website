// Handles routes like /categories/necklace, /categories/earings, etc.
const express = require("express");
const router = express.Router();
const categoryRoutes = require("../controllers/categoryController");

router.get("/:category", categoryRoutes.getCategoryProducts);
module.exports = router;
