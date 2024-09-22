const bcrypt = require("bcrypt");
const uuid = require("uuid");
const crypto = require("crypto");
const User = require("../models/User");
const passwordRegex = require("../utils/regex");
const sendVerificationEmail = require("./sendVerificationEmail");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();

const checkExistingUser = async (username, email, phoneNumber) => {
  const existingUser = await User.findOne({ username });
  const existingEmail = await User.findOne({ email });
  const existingPhoneNumber = await User.findOne({ phoneNumber });

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (existingPhoneNumber) {
    return res
      .status(400)
      .json({ message: "Provided phone number already exists" });
  }
};

const validatePassword = (password) => {
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      message:
        "'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character'",
    });
  }
};

const generateTokens = () => {
  const verificationToken = uuid.v4();
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  return { verificationToken, resetPasswordExpires, resetToken };
};

const sendVerification = (email, verificationToken) => {
  const verificationLink = `${process.env.VERIFICATION_LINK}/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2>Email Verification</h2>
          <p>Thank you for creating an account. Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p style="margin-top: 20px;">If you did not create an account, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  // Send Verification email
  return sendVerificationEmail(mailOptions, verificationLink);
};

exports.registerUser = asyncHandler(async (req, res) => {
  const { username, name, lastName, age, email, phoneNumber, password } =
    req.body;
  console.log("Req body register:", req.body);

  // Check if all required fields are present in the request body
  if (!username || !email || !password) {
    return res
      .status(404)
      .json({ message: "Missing required fields in request body" });
  }

  try {
    await checkExistingUser(username, email, phoneNumber);

    validatePassword(password);
    const { verificationToken, resetToken, resetPasswordExpires } =
      generateTokens();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      lastName,
      age,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    await newUser.save();
    await sendVerification(email, verificationToken);
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to register user" });
  }
});
