const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const { isAuthenticated, isUser } = require("../middleware/authMiddleware"); // Import auth middleware

router.get("/", homepageController.getHomePage);
router.get("/home", isAuthenticated, isUser, homepageController.getHomePage); // Example: Protect home page if it shows user-specific content
router.get("/login", homepageController.getLoginPage);
router.get("/forgetpassword", homepageController.getForgetPasswordPage);
router.get(
  "/collections/:collectionName",
  homepageController.getCollectionPage
);

module.exports = router;
