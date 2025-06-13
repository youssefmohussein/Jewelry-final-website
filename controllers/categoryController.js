const Product = require("../models/productDB");
const Collection = require("../models/collectionDB");

exports.getCategoryProducts = async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = 6; // Number of products per page
  const skip = (page - 1) * limit;
  try {
    const totalProducts = await Product.countDocuments({ category });

    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find({ category })
    .skip(skip)
    .limit(limit);
    const collections = await Collection.find();

    products.forEach((product) => {
      // Process primary image
      if (product.image && product.image.data) {
        const base64 = product.image.data.toString("base64");
        product.imageSrc = `data:${product.image.contentType};base64,${base64}`;
      } else {
        product.imageSrc = null;
      }

      // Process hover image
      if (product.hoverImage && product.hoverImage.data) {
        const hoverBase64 = product.hoverImage.data.toString("base64");
        product.hoverImageSrc = `data:${product.hoverImage.contentType};base64,${hoverBase64}`;
      } else {
        product.hoverImageSrc = null;
      }
    });

    res.render(`categories/${category}`, {
      products,
      collections,
       currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};