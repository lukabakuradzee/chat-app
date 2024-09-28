const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const sendVerificationEmail = require("./sendVerificationEmail");
const asyncHandler = require("express-async-handler");

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

// Helper function: Send confirmation email after password change
const sendPasswordChangeConfirmation = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Successfully Changed",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px; border-radius: 200px;">
          <h2>Password Successfully Changed</h2>
          <p>You are receiving this email because the password for your account: ${email} was successfully changed.</p>
          <p>If you did not make this change, please contact support immediately.</p>
        </div>
      </div>
    `,
  };

  await sendVerificationEmail(mailOptions);
};

// Main function: Set new password
exports.setNewPassword = asyncHandler(async (req, res) => {
  const { newPassword, resetToken } = req.body;

  if (!newPassword || !resetToken) {
    return res.status(400).json({ message: "New password and reset token are required." });
  }

  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});
