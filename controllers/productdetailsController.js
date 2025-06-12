// controllers/productDetailsController.js
const Product = require("../models/productDB");
const Collection = require("../models/collectionDB");
exports.getProductDetails = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId).lean();
    const collections = await Collection.find(); // for header if needed

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Convert images for main product
    if (product.image && product.image.data) {
      const base64 = product.image.data.toString("base64");
      const imageSrc = `data:${product.image.contentType};base64,${base64}`;
      product.images = [{ full: imageSrc, thumb: imageSrc }];
    } else {
      product.images = [];
    }

    const relatedProducts = await Product.aggregate([
      { $match: { _id: { $ne: product._id } } },
      { $sample: { size: 6 } },
    ]);

    // Convert images for related products
    relatedProducts.forEach((rp) => {
      if (rp.image && rp.image.data) {
        const base64 = rp.image.data.toString("base64");
        const imageSrc = `data:${rp.image.contentType};base64,${base64}`;
        rp.images = [{ full: imageSrc, thumb: imageSrc }];
      } else {
        rp.images = [];
      }
    });

    res.render("productdetailsPage", {
      product,
      collections,
      relatedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
