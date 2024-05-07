const User = require("../models/User")

exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.params; // Extract token from query parameters
      console.log("Token: ", token);
  
      const user = await User.findOne({verificationToken: token });
      // Find user by email and update email verification status
  
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found or token invalid" });
      }
  
      user.emailVerified = true;
      await user.save();
  
  
      console.log("Email Verification Success: ", user);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to verify Email" });
    }
  };
  