// for all Admin functianlity Customers/ orders/ products / collection / category
const User = require("../models/usersDB");
//                                          start of customer controller

// Get all users and render customers-dashboard view
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("dashboard/customers-dashboard", { users }); // Note folder if you use subfolder
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Edit User Role (Admin only)
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

// Delete a User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//                                       End of customer controller

//                                      Start Managing Product in Dashboard
const Product = require("../models/productDB");

// Create
exports.createProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      productNumber: req.body.productNumber,
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this productNumber already exists" });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get product by productNumber
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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("dashboard/product-dashboard", { products }); // ✅ correct
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productNumber: req.params.productNumber },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
