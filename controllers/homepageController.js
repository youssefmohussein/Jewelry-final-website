const Collection = require("../models/collectionDB");
const Product = require("../models/productDB");

exports.getHomePage = async (req, res) => {
  try {
    if (req.session.userId && req.session.role === "admin") {
      return res.redirect("/customers-dashboard");
    }

    const collections = await Collection.find();

    // Get 8 random products
    const rawProducts = await Product.aggregate([{ $sample: { size: 8 } }]);

    const products = rawProducts.map((product) => {
      let imageBase64 = "";
      if (product.image && product.image.data) {
        imageBase64 = `data:${
          product.image.contentType
        };base64,${product.image.data.toString("base64")}`;
      }

      return {
        _id: product._id,
        name: product.name,
        imageSrc: imageBase64,
      };
    });

    res.render("homePage", {
      collections,
      products,
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.render("homePage", {
      collections: [],
      products: [],
      isLoggedIn: false,
      role: null,
    });
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

// About Us page
exports.aboutus = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.render("about", { collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.render("about", { collections: [] });
  }
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

// FAQ Page
exports.faq = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.render("faq", {
      collections,
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error rendering FAQ page:", error);
    res.render("faq", {
      collections: [],
      isLoggedIn: false,
      role: null,
    });
  }
};

// Refund Policy Page (GET)
exports.refundpolicy = async (req, res) => {
  try {
    const collections = await Collection.find(); // Used for header dropdowns or links
    res.render("refundPolicy", {
      collections,
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error rendering Refund Policy page:", error);
    res.render("refundPolicy", {
      collections: [],
      isLoggedIn: false,
      role: null,
    });
  }
};

// Contact Us Page (GET)
exports.contactus = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.render("contactUs", {
      collections,
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error rendering Contact Us page:", error);
    res.render("contactUs", {
      collections: [],
      isLoggedIn: false,
      role: null,
    });
  }
};

// Contact Form Submission (POST)
exports.handleContactForm = async (req, res) => {
  try {
    const { name, email, phone, comment } = req.body;

    console.log("New contact submission:", { name, email, phone, comment });

    res.render("contactUs", {
      successMessage: "Your message has been sent!",
      collections: await Collection.find(),
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.render("contactUs", {
      errorMessage: "There was an error. Please try again later.",
      collections: [],
      isLoggedIn: false,
      role: null,
    });
  }
};
