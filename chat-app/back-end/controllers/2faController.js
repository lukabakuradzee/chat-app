const twoFactor = require("node-2fa");
const QRCode = require("qrcode");
const { send2FAEmail } = require("../utils/email");
const User = require("../models/User");

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

    const user = await User.findOne({email})
    
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }
    
    user.twoFASecret = newSecret.secret;
    await user.save();

    await send2FAEmail(email, newSecret.token);
    
    res.json({
      secret: newSecret.secret,
      qrCode: qrCodeUrl,
      message: "2FA Token was successfully sent to your email",
    });


    console.log("Secret QR: ", qrCodeUrl);
  } catch (error) {
    console.error("Error generating qr code", error);
    res.status(500).json({ message: "Error generating QR code" });
  }
};

exports.verify2FAToken = async (req, res) => {
  const { token, secret } = req.body;
  console.log("Req body: ", req.body);

  if (!token || !secret) {
    return res.status(400).json({ message: "Token and secret are required" });
  }

  const result = twoFactor.verifyToken(secret, token);

  console.log("Result: ", result);

  if (!result) {
    return res.status(400).json({ message: "Invalid 2FA token" });
  }

  // If delta is 0, the token is valid
  if (result.delta === 0) {
    return res.json({ message: "2FA token is valid" });
  } else {
    return res.status(400).json({ message: "Invalid 2FA token" });
  }
};

// exports.enable2FA = async (req, res) => {
//   const { email, token, secret } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const result = twoFactor.verifyToken(secret, token);
//     if (!result || result.delta !== 0) {
//       return res.status(400).json({ message: "Invalid 2FA token" });
//     }

//     user.twoFASecret = secret;
//     user.isTwoFactorEnabled = true;
//     await user.save();
//     res.json({ message: "Two factor auth is enabled" });
//   } catch (error) {
//     console.error("Error enabling 2FA: ", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
