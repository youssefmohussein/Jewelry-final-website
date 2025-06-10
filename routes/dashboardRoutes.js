// for all Admin functianlity Customers/ orders/ products / collection / category
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");
const upload = require("../middleware/uploads");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware"); // Import auth middleware

//-----------------------------------------------Start of Customers dashboard Routes
// Get all users and render customers dashboard page - PROTECTED (Admin only)
router.get(
  "/customers-dashboard",
  isAuthenticated,
  isAdmin,
  dashboardController.getAllUsers
);
// Edit user role by email - PROTECTED (Admin only)
router.put(
  "/users/:id/edit-role",
  isAuthenticated,
  isAdmin,
  dashboardController.editUserRole
);
// Delete user by email - PROTECTED (Admin only)
router.delete(
  "/users/email/:email",
  isAuthenticated,
  isAdmin,
  dashboardController.deleteUserByEmail
);
//-----------------------------------------------End of customers dashboard Routes-----------------------------------------------

//-----------------------------------------------Start of products dashboard routes-----------------------------------------------
router.get("/product-dashboard", dashboardController.getAllProducts);
// Create product
router.post(
  "/products",
  upload.single("image"),
  dashboardController.createProduct
);

// Get all products
router.get("/products", dashboardController.getAllProducts);
// Get product by productNumber
router.get("/products/:productNumber", dashboardController.getProductById);
// Update product
//router.put("/products/:productNumber", dashboardController.updateProduct);

router.put(
  "/products/:productNumber",
  upload.single("image"),
  dashboardController.updateProduct
);
// Delete product
router.delete("/products/:productNumber", dashboardController.deleteProduct);

//-----------------------------------------------End of products dashboard routes -----------------------------------------------

//-----------------------------------------------Start of collection routes -----------------------------------------------
// Create collection
router.post("/create",upload.single("collectionImage"), dashboardController.createCollection);

// Render collection by name
router.get("/collections/:collectionName", dashboardController.viewCollection);

//-----------------------------------------------End of collection routes -----------------------------------------------

// Orders
router.get("/orders-dashboard", dashboardController.getAllOrders);
router.put("/orders/:id", dashboardController.updateOrder);
router.delete("/orders/:id", dashboardController.deleteOrder);

module.exports = router;
