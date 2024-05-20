const User = require("../models/User")
const nodemailer = require('nodemailer')
const crypto = require('crypto')


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lukabakuradze39@gmail.com",
      pass: "nomzlhdqzjxxhlms",
    },
  });

exports.resetPassword = async function (req, res) {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with indicated email don't exists" });
      }
  
      // Generate password reset token
      const resetToken = crypto.randomBytes(20).toString("hex");
      // Set reset token and expiration time in user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Send password reset instructions to user via email
      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: email,
        subject: "Password Reset Instructions",
        html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
              <p>Please click on the following link, or paste this into your browser to complete the process:</p>
              <p>https://localhost:3000/reset-password?token=${resetToken}</p>
              <p>Token will be valid for 1 hour.
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res
        .status(200)
        .json({ message: "Password reset instructions sent to your email" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to send password reset instructions" });
    }
  };