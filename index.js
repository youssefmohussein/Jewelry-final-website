// Load environment variables from .env
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Initialize the app
const app = express();

//Routes
const userRoutes = require("./routes/userRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the template engine (optional if you're using EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

//route usage
app.use("/users", userRoutes);
app.use("/", dashboardRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Example route (optional, just to test it's working)
app.get("/", (req, res) => {
  res.send("Hello, your server is running!");
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
