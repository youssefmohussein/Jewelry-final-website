const Collection = require("../models/collectionDB");

// Homepage logic
exports.getHomePage = async (req, res) => {
  try {
    // If admin logged in, redirect to dashboard
    if (req.session.userId && req.session.role === "admin") {
      return res.redirect("/customers-dashboard");
    }

    const collections = await Collection.find();
    res.render("homePage", {
      collections,
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.render("homePage", { collections: [], isLoggedIn: false, role: null });
  }
};

// Login page
exports.getLoginPage = (req, res) => {
  res.render("loginPage");
};

// Forget password page
exports.getForgetPasswordPage = (req, res) => {
  res.render("resetPasswordPage");
};

// Specific collection page
exports.getCollectionPage = async (req, res) => {
  const { collectionName } = req.params;

  try {
    const collection = await Collection.findOne({ name: collectionName });
    const collections = await Collection.find(); // for header

    if (collection) {
      res.render("collectionPage", { collection, collections });
    } else {
      res.status(404).send("Collection not found");
    }
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).send("Server error");
  }
};
