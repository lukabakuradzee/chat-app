const dotenv = require("dotenv");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSms = async (to) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: to,
        channel: "sms",
      });
    return verification;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifySms = async (to, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: to,
        code: code,
      });
    return verificationCheck;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendSmsHandler = async (req, res) => {
  const { to } = req.body;
  try {
    const sms = await sendSms(to);
    console.log(`SMS sent successfully: ${JSON.stringify(sms)}`);
    res.status(200).json({
      success: true,
      sms,
      message: "Verification code was send successfully",
    });
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verificationCodeHandler = async (req, res) => {
  const { to, code } = req.body;
  console.log(`Verifying sms for: to=${to}, code=${code}`);
  if (!to || !code) {
    return res
      .status(400)
      .json({ success: false, message: "'to' and 'code' are required fields" });
  }
  try {
    const verifyCodeCheck = await verifySms(to, code);

    const user = await User.findOne({ phoneNumber: to });
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

    res.status(200).json({
      success: true,
      verifyCodeCheck,
      message: "Sms code verified successfully",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error verifying sms code: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendSmsHandler, verificationCodeHandler, verifySms };
