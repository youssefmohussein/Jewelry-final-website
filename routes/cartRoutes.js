const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Redirect root /cart to the rendered view
router.get("/", (req, res) => res.redirect("/cart/view"));

// Rendered EJS cart page
router.get("/view", cartController.renderCartPage);

// RESTful API routes (clean separation)
router.get("/api", cartController.getCart);
router.post("/api", cartController.addToCart);
router.put("/api/:id", cartController.updateCartItem);
router.delete("/api/:id", cartController.removeFromCart);

module.exports = router;
