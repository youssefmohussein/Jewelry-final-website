const Product = require("../models/productDB");
const Collection = require("../models/collectionDB"); // add this

exports.getCategoryProducts = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category });
    const collections = await Collection.find(); // get collections for header
    products.forEach((product) => {
      if (product.image && product.image.data) {
        const base64 = product.image.data.toString("base64");
        product.imageSrc = `data:${product.image.contentType};base64,${base64}`;
      } else {
        product.imageSrc = null;
      }
    });
    res.render(`categories/${category}`, {
      products,
      collections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
