const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const { sendPasswordChangeConfirmation } = require("../utils/email");

dotenv.config();

// Helper function: Find user by reset token and validate the expiration time
const findUserByResetToken = async (resetToken) => {
  const user = await User.findOne({ resetPasswordToken: resetToken });

  if (!user || user.resetPasswordExpires < Date.now()) {
    throw new Error("Invalid or expired token");
  }

  return user;
};

// Helper function: Check if the new password is the same as the old one
const checkSamePassword = async (newPassword, currentPassword) => {
  const isSamePassword = await bcrypt.compare(newPassword, currentPassword);
  if (isSamePassword) {
    throw new Error("You cannot set the same password, please choose a new one.");
  }
};



// Main function: Set new password
exports.setNewPassword = asyncHandler(async (req, res) => {
  const { newPassword, resetToken } = req.body;

  if (!newPassword || !resetToken) {
    return res.status(400).json({ message: "New password and reset token are required." });
  }

    // Find user by reset token and check if the token is expired
    const user = await findUserByResetToken(resetToken);

    // Check if the new password is the same as the old one
    await checkSamePassword(newPassword, user.password);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user with the new password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordChangeConfirmation(user.email);

    res.status(200).json({ message: "Password successfully changed" });
});
