const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const secretKey = require("../crypto/secretKey");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lukabakuradze39@gmail.com",
    pass: process.env.GMAIL_KEY,
  },
});

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password, resetPassword } = req.body;

    // Check if all required fields are present in the request body
    // Check if either username or email and password or resetPassword are present in the request body
    if (!identifier || (!resetPassword && !password)) {
      return res
        .status(400)
        .json({ message: "Missing required fields in request body" });
    }
    console.log("Req body: ", req.body);

    // Find user by username
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    // Check if user exists
    if (!user) {
      console.log("User not found for: ", { identifier});
      return res.status(404).json({ message: "User not found" });
    }

    // Update last login and login count
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // If resetPassword flag is provided, initiate password reset process
    if (resetPassword) {
      //  Generate password reset token
      const resetToken = crypto.randomBytes(20).toString("hex");
      // Set reset token and expiration time in user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      // Send password reset instructions to user via email
      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: user.email,
        subject: "Password Reset Instructions",
        html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
              <p>Please click on the following link, or paste this into your browser to complete the process:</p>
              <p>https://localhost:3000/reset-password?token=${resetToken}</p>
              <p>Token will be valid for 1 hour.
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return res
        .status(200)
        .json({ message: "Password reset instructions sent to your email" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign(
      {
        userAvatar: user.avatar,
        userId: user.id,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      secretKey,
      { expiresIn: "24h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "7d",
    });

    // Password is correct, return success
    res.status(200).json({ message: "Login successful", token, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
};
