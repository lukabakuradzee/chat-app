const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from query parameters
    console.log("Token: ", token);

    const user = await User.findOne({ verificationToken: token });
    // Find user by email and update email verification status

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or token invalid" });
    }

    user.emailVerified = true;
    await user.save();

    const newToken = jwt.sign(
      {
        userId: user.id,
        userAvatar: user.avatar,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );



    console.log("Email Verification Success: ", user);
    res.status(200).json({ message: "Email verified successfully", token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify Email" });
  }
};
