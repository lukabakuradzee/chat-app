const User = require("../models/User");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const { sendResetPasswordEmail } = require("../utils/email");
const { logActivity } = require("../services/activityLogService");
require("dotenv").config();

const generateToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordExpires = Date.now() + 3600000;
  return { resetToken, resetPasswordExpires };
};

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log("Req body reset password: ", req.body);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  const userIp = req.ip;

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

  try {
    await logActivity(
      user._id,
      "password_reset_requested",
      "Password reset instructions sent",
      userIp,
      req.get("User-Agent")
    );
    console.log("user id :", user._id);
    console.log("user ip :", userIp);
    console.log("user id :", req.get);
  } catch (error) {
    console.error("error creating log activity", error);
  }

  res
    .status(200)
    .json({ message: "Password reset instructions sent successfully" });

  // Send password reset instructions to user via email
  await sendResetPasswordEmail(email, resetPasswordLink);
});
