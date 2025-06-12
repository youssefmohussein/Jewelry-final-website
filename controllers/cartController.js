const Product = require("../models/productDB");

exports.getCartPage = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const cartItems = [];
    let subtotal = 0;

    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      let imageSrc = null;
      if (product.image && product.image.data) {
        const base64 = product.image.data.toString("base64");
        imageSrc = `data:${product.image.contentType};base64,${base64}`;
      }

      const totalItemPrice = product.price * item.quantity;
      subtotal += totalItemPrice;

      cartItems.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: imageSrc,
        productId: item.productId
      });
    }

    const tax = subtotal * 0.15;
    const shipping = subtotal > 0 ? 5000 : 0;
    const total = subtotal + tax + shipping;

    res.render("cartPage", {
      cartItems,
      collections: [], // Add actual collections if needed
      isLoggedIn: !!req.session.userId,
      role: req.session.role,
      subtotal,
      tax,
      shipping,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.addToCart = (req, res) => {
  const { productId, quantity } = req.body; // quantity is missing in your original
  if (!req.session.cart) req.session.cart = [];

  const cart = req.session.cart;
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity += parseInt(quantity); // Make sure to parseInt
  } else {
    cart.push({ productId, quantity: parseInt(quantity) });
  }

  res.json({ success: true, cart });
};
exports.removeFromCart = (req, res) => {
  
  const { productId } = req.body;
  req.session.cart = (req.session.cart || []).filter(
    item => item.productId.toString() !== productId
  );
  res.json({ success: true });
};

exports.updateCartQuantity = (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) return res.json({ success: false, message: "Cart is empty" });

  const cart = req.session.cart;
  const item = cart.find(item => item.productId === productId);

  if (!item) {
    return res.json({ success: false, message: "Item not found" });
  }

  item.quantity = parseInt(quantity);
  res.json({ success: true });
};
