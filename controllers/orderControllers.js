const mongoose = require("mongoose");
const Order = require("../models/orderDB");

exports.renderOrderPage = (req, res) => {
  const generatedOrderId = 'ORD' + Date.now();
  const userId = new mongoose.Types.ObjectId().toString();
  const productIds = [
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString()
  ].join(',');
  const totalQuantity = 3;
  const totalPrice = 250.75;

  res.render('orderpage', {
    generatedOrderId,
    userId,
    productIds,
    totalQuantity,
    totalPrice
  });
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

    const productObjectIds = productIds.split(',').map(id => {
      if (!mongoose.Types.ObjectId.isValid(id.trim())) {
        throw new Error(`Invalid Product ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id.trim());
    });

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

