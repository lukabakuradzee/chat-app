const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const secretKey = require("../crypto/secretKey");

// Generate verification Token
const generateVerificationToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: "24" });
};

// Send verification Email

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    // configure your email provider
    service: "gmail",
    auth: {
      user: "lukabakuradze39@gmail.com",
      pass: "nomzlhdqzjxxhlms",
    },
  });

  // Compose email message
  const mailOptions = {
    from: "lukabakuradze39@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email: http://yourdomain.com/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.registerUser = async (req, res) => {
  try {
    const { username, name, lastName, age, email, password } = req.body;
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // generate token
    const verificationToken = generateVerificationToken(email);

    // Check if all required fields are present in the request body
    if (!username || !email || !password) {
      throw new Error("Missing required fields in request body");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      lastName,
      age,
      email,
      password: hashedPassword,
      verificationToken,
    });
    await newUser.save();

    // Send Verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // verify token
    const decoded = jwt.verify(token.split(" ")[1], secretKey);

    // Find user by email and update email verification status
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { $set: { emailVerified: true } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify Email" });
  }
};
