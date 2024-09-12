const User = require("../models/User");
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const sendVerificationEmail = require("./sendVerificationEmail");
dotenv.config();


exports.setNewPassword = async (req, res) => {
    try {
      const { newPassword, resetToken } = req.body;
      const user = await User.findOne({ resetPasswordToken: resetToken });
      const { email } = user;
  
      // If no user is found with the given reset token or token has expired
      if (!user || user.resetPasswordExpires < Date.now()) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if(isSamePassword) {
          return res.status(403).json({
            message: "You cannot set the same password, please choose the new one"
          })
        }


    
      // Password was successfully changed
      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: email,
        subject: "Password was successfully changed",
        html:`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px; border-radius: 200px;">
          <h2>Your Password was successfully changed</h2>
          <p style="margin-top: 20px;">You are receiving this email because you (or someone else) has changed password for your account: ${user.email}
          <p ">If you did not change an account password, please ignore this email.</p>
        </div>
      </div>
      `
      };
      
  
      await sendVerificationEmail(mailOptions);
  
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
