const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");
// Auth and user management routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/logout", userController.logoutUser); // New route to handle user logout
router.get("/profile", isAuthenticated, userController.getUserProfile);
module.exports = router;
