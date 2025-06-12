const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/productdetailsController");
router.get("/product/:id", homepageController.getProductDetails);

module.exports = router;
