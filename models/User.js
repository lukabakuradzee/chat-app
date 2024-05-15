const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: 'http://localhost:5500/uploads/avatar.jpg',
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  verificationToken: {
    type: String,
    required: true,
    unique: true,
  }
});


const User = mongoose.model("User", userSchema);

module.exports = User;
