const mongoose = require("mongoose");
const User = require("../models/usersDB");
const Order = require("../models/orderDB");
const bcrypt = require("bcryptjs");

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // --- Session Management: Set session data upon successful login ---
    req.session.userId = user._id; // Store user ID in session
    req.session.role = user.role; // Store user role in session for authorization checks
    req.session.name = user.name; // Store user name in session
    req.session.email = user.email; // Store user email in session
    // You can store any other relevant user data in the session here
    res.status(200).json({
      message: "Login successful!",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Email, password, and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = password; // Let schema middleware hash it
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = (req, res) => {
  // Destroy the session associated with the current request.
  // This removes the session data from the server's session store.
  req.session.destroy((err) => {
    if (err) {
      // If an error occurs during session destruction, log it and send a 500 response
      console.error("Error destroying session:", err);
      return res
        .status(500)
        .json({ message: "Could not log out, please try again." });
    }
    // Clear the session cookie from the client's browser.
    // "connect.sid" is the default name for the session cookie used by express-session.
    res.clearCookie("connect.sid");
    // Send a success response upon successful logout
    res.status(200).json({ message: "Logged out successfully!" });
  });
};

exports.getUserProfile = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Fetch user's orders
    const orders = await Order.find({ user: user._id })
      .sort({ orderDate: -1 }) // Sort by order date, newest first
      .limit(5); // Limit to 5 most recent orders

    res.render("userProfile", {
      user,
      orders,
      isLoggedIn: true,
      role: req.session.role
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).send("Server error");
  }
};

exports.updateUserEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email: email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Email updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};