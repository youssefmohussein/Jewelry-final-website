// controllers/productDetailsController.js
const Product = require("../models/productDB");
const Collection = require("../models/collectionDB");
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
