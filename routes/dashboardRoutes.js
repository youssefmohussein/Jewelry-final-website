// for all Admin functianlity Customers/ orders/ products / collection / category
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");
const upload = require("../middleware/uploads");

//-----------------------------------------------Start of Customers dashboard Routes
// Get all users and render customers dashboard page
router.get("/customers-dashboard", dashboardController.getAllUsers);
// Edit user role by ID
router.put("/users/:id/edit", dashboardController.editUserRole);
// Delete user by ID
router.delete("/users/:id/delete", dashboardController.deleteUser);

//-----------------------------------------------End of customers dashboard Routes-----------------------------------------------

//-----------------------------------------------Start of products dashboard routes-----------------------------------------------
router.get("/product-dashboard", dashboardController.getAllProducts);
// Create product
router.post('/products', upload.single('image'), dashboardController.createProduct);

// Get all products
router.get("/products", dashboardController.getAllProducts);
// Get product by productNumber
router.get("/products/:productNumber", dashboardController.getProductById);
// Update product
router.put("/products/:productNumber", dashboardController.updateProduct);
// Delete product
router.delete("/products/:productNumber", dashboardController.deleteProduct);


//-----------------------------------------------End of products dashboard routes -----------------------------------------------

//-----------------------------------------------Start of collection routes -----------------------------------------------
// Create collection
router.post("/create", dashboardController.createCollection);

// Render collection by name
router.get("/collections/:collectionName", dashboardController.viewCollection);

//-----------------------------------------------End of collection routes -----------------------------------------------

module.exports = router;
