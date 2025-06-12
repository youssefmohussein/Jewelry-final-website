require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session"); // Import express-session
const cookieParser = require("cookie-parser"); // Import cookie-parser
// Initialize the app
const app = express();

// Routes
const userRoutes = require("./routes/userRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productdetailsRoute = require("./routes/productdetailsRoutes");
const handleError = require("./utils/errorHandle");
const cartRoutes = require("./routes/cartRoute");
// Middleware
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
//collection w category ashan mybozosh m3 el sessions
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.role = req.session.role || null;
  next();
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", userRoutes);
app.use("/", dashboardRoutes);
app.use("/", homepageRoutes);
app.use("/categories", categoryRoutes);
app.use("/", orderRoutes);
app.use("/", productdetailsRoute);
app.use("/", cartRoutes);

app.use((req, res) => {
  handleError(res, 404, 'Page Not Found');
});

// MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
