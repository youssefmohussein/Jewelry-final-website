// for all Admin functianlity Customers/ orders/ products / collection / category

//------------------------------------start of customer controller-----------------------------------------------------
const User = require("../models/usersDB");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("dashboard/customers-dashboard", { users });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
exports.editUserRole = async (req, res) => {
  const { role } = req.body;
  if (role !== "admin" && role !== "customer") {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "role updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//----------------------------------------End of customer controller-----------------------------------------------------

//----------------------------------------Start Managing Product in Dashboard-----------------------------------------------------

const Product = require("../models/productDB");


const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    if (!req.files || !req.files["image"]) {
      return res.status(400).json({ error: "Main image is required" });
    }

    const existingProduct = await Product.findOne({
      productNumber: req.body.productNumber,
    });
    if (existingProduct) {
      return res.status(400).json({
        error: "Product with this productNumber already exists",
      });
    }

    const image = req.files["image"][0];
    const hoverImage = req.files["hoverImage"]?.[0];

    const product = new Product({
      productNumber: req.body.productNumber,
      name: req.body.name,
      description: req.body.description,
      colors: JSON.parse(req.body.colors),
      category: req.body.category,
      collection: req.body.collection,
      stock: req.body.stock,
      price: req.body.price,
      totalSales: req.body.totalSales || 0,

      image: {
        data: image.buffer,
        contentType: image.mimetype,
      },

      ...(hoverImage && {
        hoverImage: {
          data: hoverImage.buffer,
          contentType: hoverImage.mimetype,
        },
      }),
    });

    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

///////////////

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      productNumber: req.params.productNumber,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
};
///////////
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("dashboard/product-dashboard", { products });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

/////////////
exports.updateProduct = async (req, res) => {
  try {
    const productNumber = req.params.productNumber;

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      colors: req.body.colors
        ? req.body.colors.split(",").map((color) => color.trim())
        : [],
      category: req.body.category,
      collection: req.body.collection,
      stock: req.body.stock,
      price: req.body.price,
    };

    if (req.file) {
      updatedData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const product = await Product.findOneAndUpdate(
      { productNumber },
      updatedData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
/////////////
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      productNumber: req.params.productNumber,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//----------------------------------------------------End of products-----------------------------------------------------

//-----------------------------------------------Start of Collection-----------------------------------------------------
const Collection = require("../models/collectionDB");

exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;

    // Basic validation
    if (!name || !req.file) {
      return res
        .status(400)
        .json({ message: "Both name and image are required." });
    }

    // Create and save the new collection
    const newCollection = new Collection({
      name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newCollection.save();

    res.status(201).json({
      message: "Collection created successfully",
      collection: newCollection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// leha 3laka bl hover 
exports.viewCollection = async (req, res) => {
  const { collectionName } = req.params;

  try {
    const collection = await Collection.findOne({ name: collectionName });
    const collections = await Collection.find(); // for header

    if (!collection) {
      return res.status(404).send("Collection not found");
    }

    // Generate base64 image for collection
    if (collection.image && collection.image.data) {
      const base64 = collection.image.data.toString("base64");
      collection.imageSrc = `data:${collection.image.contentType};base64,${base64}`;
    } else {
      collection.imageSrc = null;
    }

    // Get products in this collection
    const products = await Product.find({ collection: collection.name }).lean();

    products.forEach((product) => {
      // Original image
      if (product.image && product.image.data) {
        const base64 = product.image.data.toString("base64");
        product.imageSrc = `data:${product.image.contentType};base64,${base64}`;
      } else {
        product.imageSrc = null;
      }

      // Hover image
      if (product.hoverImage && product.hoverImage.data) {
        const hoverBase64 = product.hoverImage.data.toString("base64");
        product.hoverImageSrc = `data:${product.hoverImage.contentType};base64,${hoverBase64}`;
      } else {
        product.hoverImageSrc = null;
      }
    });

    res.render("collectionPage", {
      collection,
      collections,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};








//-----------------------------------------------------End of Collection -----------------------------------------------------

//-----------------------------------------------------Start of Order -----------------------------------------------------
const Order = require("../models/orderDB");
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.render("dashboard/orders-dashboard", { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, shippingAddress, total_price, phone } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(shippingAddress && { shippingAddress }),
        ...(total_price && { total_price }),
        ...(phone && { phone }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-----------------------------------------------------End of Orders -----------------------------------------------------

// ... imports ...
exports.getDashboard = async (req, res) => {
  console.log("Attempting to load dashboard data...");
  let customerCount = 0;
  let orderCount = 0;
  let productCount = 0;

  try {
    console.log("Querying Customer count...");
    // You named your customer model "User" in usersDB.js, so use User here.
    customerCount = await User.countDocuments({}); // <-- FIX IS HERE: Changed Customer to User
    console.log("Customer count:", customerCount);

    console.log("Querying Order count...");
    orderCount = await Order.countDocuments({});
    console.log("Order count:", orderCount);

    console.log("Querying Product count...");
    productCount = await Product.countDocuments({});
    console.log("Product count:", productCount);

    res.render("/dashboard/dashboardPage", {
      customerCount,
      orderCount,
      productCount,
    });
  } catch (error) {
    console.error("Specific error details:", error); // THIS IS KEY!
    console.error(
      "Error fetching dashboard data: A problem occurred while querying the database."
    );
    res.status(500).send("Error loading dashboard");
  }
};
// dashboardControllers.js

// ... (your imports like const User = require("../models/usersDB"); etc. should be at the top)

exports.getDashboard = async (req, res) => {
  console.log("Attempting to load dashboard data...");
  let customerCount = 0;
  let orderCount = 0;
  let productCount = 0;

  try {
    console.log("Querying Customer count...");
    customerCount = await User.countDocuments({});
    console.log("Customer count:", customerCount);

    console.log("Querying Order count...");
    orderCount = await Order.countDocuments({});
    console.log("Order count:", orderCount);

    console.log("Querying Product count...");
    productCount = await Product.countDocuments({});
    console.log("Product count:", productCount);

    // --- FIX IS HERE: Change the view path to match your folder structure ---
    res.render("dashboard/dashboardPage", {
      // <--- THIS IS THE CORRECT PATH
      customerCount,
      orderCount,
      productCount,
    });
  } catch (error) {
    console.error("Specific error details:", error);
    console.error(
      "Error fetching dashboard data: A problem occurred while querying the database."
    );
    res.status(500).send("Error loading dashboard");
  }
};

// ... (rest of your controller functions) ...
