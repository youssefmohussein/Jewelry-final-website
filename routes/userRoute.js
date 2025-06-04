const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Render login/signup page
router.get("/login", (req, res) => {
  res.render("loginPage"); // Make sure views/loginPage.ejs exists
});

// Auth and user management routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);

// User CRUD routes by Email param
router.get("/:Email", userController.getUserByEmail);
router.put("/:Email", userController.updateUser);
router.delete("/:Email", userController.deleteUser);

module.exports = router;
