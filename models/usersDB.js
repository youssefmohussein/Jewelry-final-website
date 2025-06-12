const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersManagementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);
      },
      message: (props) =>
        `Password must contain at least one letter, one number, and be at least 8 characters long.`,
    },
  },
  
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
    required: false,
  },
});

usersManagementSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const users = mongoose.model("users", usersManagementSchema);
module.exports = users;
