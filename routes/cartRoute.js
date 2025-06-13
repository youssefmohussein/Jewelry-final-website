const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming authMiddleware.js is in a 'middleware' folder

router.get("/cart", cartController.getCartPage);
router.post("/cart/add", authMiddleware.isUser, cartController.addToCart);
router.post("/cart/remove", authMiddleware.isUser, cartController.removeFromCart);
router.post("/cart/update-quantity", authMiddleware.isUser, cartController.updateCartQuantity);
module.exports = router;