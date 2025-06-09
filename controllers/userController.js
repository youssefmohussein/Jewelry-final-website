const mongoose = require("mongoose");
const User = require("../models/usersDB");
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
