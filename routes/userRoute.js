const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Auth and user management routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/logout", userController.logoutUser); // New route to handle user logout

module.exports = router;
