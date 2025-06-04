const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");

router.get("/", homepageController.getHomePage);
router.get("/home", homepageController.getHomePage);
router.get("/login", homepageController.getLoginPage);
router.get("/forgetpassword", homepageController.getForgetPasswordPage);
router.get(
  "/collections/:collectionName",
  homepageController.getCollectionPage
);

module.exports = router;
