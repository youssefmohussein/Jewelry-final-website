const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", homepageController.getHomePage);
router.get("/home", isAuthenticated, homepageController.getHomePage);
router.get("/login", homepageController.getLoginPage);
router.get("/forgetpassword", homepageController.getForgetPasswordPage);
router.get("/about-us", homepageController.aboutus);
router.get("/faq", homepageController.faq);

// Contact Us routes
router.get("/contact-us", homepageController.contactus);
router.post("/contact-us", homepageController.handleContactForm);

router.get("/collections/:collectionName", homepageController.getCollectionPage);

module.exports = router;
