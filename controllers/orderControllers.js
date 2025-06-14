const mongoose = require("mongoose");
const Order = require("../models/orderDB");
const Product = require("../models/productDB");

exports.renderOrderPage = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      return res.redirect('/cart'); // Prevent ordering empty cart
    }

    let totalQuantity = 0;
    let totalPrice = 0;
    let productIds = [];

    for (const item of cart) {
  console.log("Trying to find product with ID:", item.productId);

  const product = await Product.findById(item.productId);

  if (!product) {
    console.warn("Product not found for ID:", item.productId);
    continue;
  }

  console.log("Product found:", product.name);

  totalQuantity += item.quantity;
  totalPrice += item.quantity * product.price;
  productIds.push(product._id);
}


    const tax = totalPrice * 0.15;
    const shipping = totalPrice > 0 ? 5000 : 0;
    const finalTotalPrice = totalPrice + tax + shipping;

    const generatedOrderId = 'ORD' + Date.now();
    const userId = req.session.userId || new mongoose.Types.ObjectId().toString();

    res.render('orderpage', {
      generatedOrderId,
      userId,
      productIds: productIds.join(','),
      totalQuantity,
      totalPrice: finalTotalPrice
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading checkout page");
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      fullName, email, phone, address, country, city, postalCode,
      generatedOrderId, userId, productIds, totalQuantity, totalPrice, Payment_method
    } = req.body;

    if (!generatedOrderId || !userId || !productIds || !totalQuantity || !totalPrice ||
        !address || !city || !postalCode || !country || !phone || !fullName || !email) {
      return res.status(400).json({ error: "Missing required order information." });
    }

    const existingOrder = await Order.findOne({ orderId: generatedOrderId });
    if (existingOrder) {
      return res.status(400).json({ error: "Order with this ID already exists." });
    }

    const productIdArray = productIds.split(',').map(id => id.trim());
    const productObjectIds = [];
    const productNames = [];

    for (const id of productIdArray) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid Product ID: ${id}`);
      }
      const product = await Product.findById(id);
      if (product) {
        productObjectIds.push(product._id);
        productNames.push(product.name);
      }
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const newOrder = new Order({
      orderId: generatedOrderId,
      user: userObjectId,
      phone,
      quantity: parseInt(totalQuantity),
      total_price: parseFloat(totalPrice),
      product_ids: productObjectIds,
      product_names: productNames,
      customerName: fullName,             
      customerEmail: email,
      shippingAddress: {
        address,
        city,
        postalCode,
        country
      },
      Payment_method
    });

    await newOrder.save();
    console.log("Order saved successfully:", newOrder);
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    // Clear the cart from session
    if (req.session.cart) {
      req.session.cart = [];
    }

    // Render the order page with success message
    return res.render("orderpage", {
      success: true,
      message: "Order placed successfully!",
      generatedOrderId,
      userId,
      productIds: productIds,
      totalQuantity,
      totalPrice,
      name: fullName,
      email,
      phone,
      address,
      country,
      city,
      postalCode
    });
  } catch (err) {
    console.error("Error creating order:", err);
    if (err.name === 'ValidationError') {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ error: "Validation failed", details: errors });
    }
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
    await newOrder.save();
    req.session.cart = []; // clear the cart after order placed
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
};

// orderControllers.js
exports.getOrdersForDashboard = async (req, res) => {
    try {
        const { search, status } = req.query; // Get search and status from query parameters

        let query = {};

        // Apply search filter if present
        if (search) {
            // Case-insensitive search on orderId
            query.orderId = { $regex: search, $options: 'i' }; // <--- THIS IS THE ORDER ID SEARCH
        }
        // ... rest of the code
    } catch (err) {
        // ...
    }
};
exports.getProductsForDashboard = async (req, res) => {
    try {
        const { search, category } = req.query; // Get search term and category filter

        let query = {};

        // Build search query using $regex for case-insensitive search
        if (search) {
            query.$or = [ // Search across name, description, and category fields
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Apply category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query).sort({ name: 1 }); // Sort by name

        // Check if the request is an AJAX/fetch request
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ products });
        } else {
            // For initial page load, render the EJS template
            return res.render('products-dashboard', { products });
        }

    } catch (error) {
        console.error("Error fetching products for dashboard:", error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ message: "Internal server error" });
        } else {
            return res.status(500).send("Server Error");
        }
    }
};
