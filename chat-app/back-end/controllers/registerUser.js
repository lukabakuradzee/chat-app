const bcrypt = require("bcrypt");
const uuid = require("uuid");
const crypto = require("crypto");
const User = require("../models/User");
const passwordRegex = require("../utils/regex");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const { sendVerification } = require("../utils/email");

dotenv.config();

const checkExistingUser = async (username, email, phoneNumber, res) => {
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

const validatePassword = (password, res) => {
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
