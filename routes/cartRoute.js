const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/cart", cartController.getCartPage);
router.post("/cart/add", cartController.addToCart);
router.post("/cart/remove", cartController.removeFromCart);

module.exports = router;
