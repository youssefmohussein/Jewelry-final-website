const Collection = require("../models/collectionDB");

// Homepage logic
exports.getHomePage = async (req, res) => {
  try {
    if (req.session.userId) {
      // User is logged in, redirect them based on their role
      if (req.session.role === "admin") {
        return res.redirect("/customers-dashboard"); // Redirect admin to admin dashboard
      } else if (req.session.role === "customer") {
        // If it's a customer, redirect to their specific authenticated home/dashboard.
        // The '/home' route is already protected by 'isUser' middleware.
        return res.redirect("/home");
      }
      // Fallback for unexpected roles, redirect to customer home
      return res.redirect("/home");
    }
    const collections = await Collection.find();
    res.render("homePage", { collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.render("homePage", { collections: [] });
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
