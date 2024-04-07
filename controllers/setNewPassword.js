const User = require("../models/User");
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lukabakuradze39@gmail.com",
      pass: "nomzlhdqzjxxhlms",
    },
  });

exports.setNewPassword = async (req, res) => {
    try {
      const { newPassword, resetToken } = req.body;
      const user = await User.findOne({ resetPasswordToken: resetToken });
      const { email } = user;
  
      // If no user is found with the given reset token or token has expired
      if (!user || user.resetPasswordExpires < Date.now()) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }
  
      // Password was successfully changed
      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: email,
        subject: "Password was successfully changed",
        html: `<p>You are receiving this email because you (or someone else) has changed password for your account.</p>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(200).json({ message: "Password successfully changed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to change password" });
    }
  };
