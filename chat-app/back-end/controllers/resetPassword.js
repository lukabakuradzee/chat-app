const User = require("../models/User");
const crypto = require("crypto");
const sendVerificationEmail = require("./sendVerificationEmail");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const generateToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordExpires = Date.now() + 3600000;
  return { resetToken, resetPasswordExpires };
};

const sendResetPasswordEmail = async (email, resetPasswordLink) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Instructions",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
        <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h2>Password Reset instructions</h2>
        <p>Please click the button to reset your account password:</p>
        <a href="${resetPasswordLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="margin-top: 20px;">Token will be valid for 1 hour.
        <p style="margin-top: 20px;">If you did not request this, please ignore this email and your password will remain unchanged</p>
      </div>
    </div>`,
  };
  return sendVerificationEmail(mailOptions);
};

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "User with specified email does not exists" });
  }

  const { resetToken, resetPasswordExpires } = generateToken();
  const resetPasswordLink = `${process.env.RESET_PASSWORD_LINK}/?token=${resetToken}`;
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetPasswordExpires;

  await user.save();

  // Send password reset instructions to user via email
  await sendResetPasswordEmail(email,resetPasswordLink);
});
