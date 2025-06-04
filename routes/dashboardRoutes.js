// for all Admin functianlity Customers/ orders/ products / collection / category
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");

// Get all users and render customers dashboard page
router.get("/customers-dashboard", dashboardController.getAllUsers);

// Edit user role by ID
router.put("/users/:id/edit", dashboardController.editUserRole);

// Delete user by ID
router.delete("/users/:id/delete", dashboardController.deleteUser);

module.exports = router;

//              End of customers dashboard Routes
