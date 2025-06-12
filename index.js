// Load environment variables from .env
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session"); // Import express-session
const cookieParser = require("cookie-parser"); // Import cookie-parser
// Initialize the app
const app = express();

//Routes
const userRoutes = require("./routes/userRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require('./routes/cartRoutes');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const MongoStore = require("connect-mongo"); // Import connect-mongo

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
      ttl: 1000 * 60 * 60 * 24 * 7, // Session TTL in seconds (1 week)
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Checks for expired sessions every 10 minutes
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds (for "remember me")
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    },
  })
);

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
app.use("/", homepageRoutes);
app.use("/categories", categoryRoutes);
app.use('/cart', cartRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Example route (optional, just to test it's working)

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
