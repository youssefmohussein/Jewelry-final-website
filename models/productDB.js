const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  colors: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.every((color) => typeof color === "string");
      },
      message: "The color must be a String.",
    },
    required: false,
  },
  category: {
    type: String,

    required: true,
  },
  collection: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  image: {
    data: Buffer,
    contentType: String,
  },
  //for second photo
  hoverImage: {
    data: Buffer,
    contentType: String,
  },

  salesCount: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
