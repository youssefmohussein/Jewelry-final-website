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

// controllers/productDetailsController.js
const Product = require("../models/productDB");

exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // Get the product
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Convert image binary data to base64 if needed
    if (product.image && product.image.data) {
      const base64 = product.image.data.toString("base64");
      const dataUrl = `data:${product.image.contentType};base64,${base64}`;
      product.images = [{ full: dataUrl, thumb: dataUrl }];
    }

    // Get related products from same category, excluding this one
    const rawRelated = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(4)
      .lean();

    // Convert related product images
    const relatedProducts = rawRelated.map((rp) => {
      if (rp.image && rp.image.data) {
        const base64 = rp.image.data.toString("base64");
        const dataUrl = `data:${rp.image.contentType};base64,${base64}`;
        rp.images = [{ full: dataUrl, thumb: dataUrl }];
      } else {
        rp.images = [];
      }
      return rp;
    });

    // Get collections for header/footer
    const collections = await Collection.find({}).lean();

    // Render the EJS page
    res.render("productdetailsPage", {
      product,
      relatedProducts,
      collections,
    });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(500).send("Server error");
  }
};
