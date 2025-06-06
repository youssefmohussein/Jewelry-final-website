const Product = require("../models/productDB");
const Collection = require("../models/collectionDB"); // add this

exports.getCategoryProducts = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category });
    const collections = await Collection.find(); // get collections for header
    res.render(`categories/${category}`, {
      products,
      collections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
