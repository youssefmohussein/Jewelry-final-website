// Middleware to check if a user is authenticated
exports.isAuthenticated = (req, res, next) => {
  // Check if session has a user ID
  if (req.session.userId) {
    // If authenticated, proceed to the next middleware/route handler
    next();
  } else {
    // If not authenticated, redirect to login page
    // You might want to store the original URL to redirect back after successful login
    res.redirect("/login");
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  // Assuming user role is stored in session
  if (req.session.role === "admin") {
    next(); // If admin, proceed
  } else {
    // If not admin, send forbidden status or redirect
    res.status(403).send("Access Denied: Admins only.");
  }
};

// Middleware to check if the user is a customer
exports.isUser = (req, res, next) => {
  // Assuming the user's role is stored in the session
  if (req.session.role === "customer") {
    // If the user is a customer, proceed
    next();
  } else {
    // If not a customer (or role is missing), send a 403 Forbidden status.
    // The message "Error in login /sessions" is a bit broad; consider a more specific message if needed.
    res.status(403).send("Access Denied: Customers only.");
  }
};
