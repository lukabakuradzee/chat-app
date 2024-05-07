const User = require("../models/User");
const sendVerificationEmail = require("./sendVerificationEmail");

exports.resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationLink = `${req.protocol}://localhost:3000/verify-email/${user.verificationToken}`;

    await sendVerificationEmail(user.email, verificationLink);
    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error sending verification email", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
