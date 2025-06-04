// for all Admin functianlity Customers/ orders/ products / collection / category

const User = require("../models/usersDB");

//                                          start of customer controller

// Get all users and render customers-dashboard view
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("dashboard/customers-dashboard", { users }); // Note folder if you use subfolder
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Edit User Role (Admin only)
exports.editUserRole = async (req, res) => {
  const { role } = req.body;
  if (role !== "admin" && role !== "customer") {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "role updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//                                       End of customer controller
