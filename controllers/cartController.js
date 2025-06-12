const CartItem = require('../models/cartDB');

// Get all cart items (API)
async function getCart(req, res) {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add item to cart
async function addToCart(req, res) {
  try {
    const { name, price, quantity, image } = req.body;
    const newItem = new CartItem({ name, price, quantity, image });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update cart item
// Update cart item
async function updateCartItem(req, res) {
  try {
    const { id } = req.params;
    const { change } = req.body;

    const item = await CartItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity += change;

    if (item.quantity <= 0) {
      await item.deleteOne();
      return res.json({ message: "Item removed" });
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Delete cart item
async function removeFromCart(req, res) {
  try {
    const { id } = req.params;
    const deletedItem = await CartItem.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Reusable helper
async function getCartItemsByUser() {
  try {
    return await CartItem.find();
  } catch (error) {
    console.error("Error in getCartItemsByUser:", error);
    return [];
  }
}

// Render EJS cart page
async function renderCartPage(req, res) {
  try {
    const cartItems = await getCartItemsByUser();

    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.15;
    const shipping = subtotal > 0 ? 5000 : 0;
    const total = subtotal + tax + shipping;

    res.render("cart", {
      cartItems,
      subtotal,
      tax,
      shipping,
      total
    });
  } catch (error) {
    res.status(500).send("Error loading cart page");
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItemsByUser,
  renderCartPage,
};
