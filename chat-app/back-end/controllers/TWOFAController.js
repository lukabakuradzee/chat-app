const twoFactor = require("node-2fa");
const QRCode = require("qrcode");
// const { send2FAEmail } = require("../utils/email");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.generate2FASecret = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const newSecret = twoFactor.generateSecret({
    name: "SocialApp",
    account: email,
  });
  try {
    const qrCodeUrl = await QRCode.toDataURL(newSecret.uri);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFASecret = newSecret.secret;
    await user.save();


    res.json({
      secret: newSecret.secret,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    console.error("Error generating qr code", error);
    res.status(500).json({ message: "Error generating QR code" });
  }
};

exports.verify2FAToken = async (req, res) => {
  const { token, secret, email } = req.body;
  console.log("Req body: ", req.body);

  if (!token || !secret || !email) {
    return res.status(400).json({ message: "Token and secret and email are required" });
  }

  const result = twoFactor.verifyToken(secret, token);

  if (!result) {
    return res.status(400).json({ message: "Invalid 2FA token" });
  }

  // If delta is 0, the token is valid
  if (result.delta === 0) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }


      const jwtToken = jwt.sign(
        {
          userAvatar: user.avatar,
          userId: user.id,
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          age: user.age,
          email: user.email,
          phoneNumber: user.phoneNumber,
          emailVerified: user.emailVerified,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({
        message: "2FA token is valid",
        token: jwtToken, 
      });
      
    } catch (error) {
      console.error("Error verifying 2FA token:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid 2FA token" });
  }
};
