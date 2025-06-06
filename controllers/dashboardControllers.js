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

//----------------------------------------End of customer controller-----------------------------------------------------

//----------------------------------------Start Managing Product in Dashboard-----------------------------------------------------

const Product = require("../models/productDB");


/*exports.createProduct = async (req, res) => {
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
};*/

const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    // 1. Check for duplicate product
    const existingProduct = await Product.findOne({
      productNumber: req.body.productNumber,
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: 'Product with this productNumber already exists' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // 3. Read image file
    const imageData = fs.readFileSync(req.file.path);

    // 4. Create product with image buffer
    const product = new Product({
      ...req.body, 
      image: {
        data: imageData,
        contentType: req.file.mimetype,
      },
    });

    await product.save();

    // 5. Remove file from server after saving to DB
    fs.unlinkSync(req.file.path);

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

////

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
    res.render("dashboard/product-dashboard", { products });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productNumber = req.params.productNumber;

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      colors: req.body.colors ? req.body.colors.split(',').map(color => color.trim()) : [],
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
    const { name, image } = req.body;

    // Basic validation
    if (!name || !image) {
      return res
        .status(400)
        .json({ message: "Both name and image are required." });
    }

    // Create and save the new collection
    const newCollection = new Collection({ name, image });
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

/*exports.viewCollection = async (req, res) => {
  const { collectionName } = req.params;

  try {
    const collection = await Collection.findOne({ name: collectionName });
    const collections = await Collection.find(); // for header

    if (!collection) {
      return res.status(404).send("Collection not found");
    }

    const products = await Product.find({ collection: collection.name });

    res.render("collectionPage", {
      collection,
      collections,
      products, // ✅ send this to the view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};*/
exports.viewCollection = async (req, res) => {
  const { collectionName } = req.params;

  try {
    const collection = await Collection.findOne({ name: collectionName });
    const collections = await Collection.find(); // for header

    if (!collection) {
      return res.status(404).send("Collection not found");
    }

    
    const products = await Product.find({ collection: collection.name }).lean();

  
    products.forEach(product => {
      if (product.image && product.image.data) {
        const base64 = product.image.data.toString('base64');
        product.imageSrc = `data:${product.image.contentType};base64,${base64}`;
      } else {
        product.imageSrc = null; 
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
