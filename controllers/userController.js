const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = require("../crypto/secretKey");

exports.registerUser = async (req, res) => {
  try {
    const { username, name, lastName, age, email, password } = req.body;
    // console.log("Req body user registration: " + JSON.stringify(req.body))

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
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if all required fields are present in the request body
    if (!username || !password) {
      throw new Error("Missing required fields in request body");
    }

    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secretKey,
      { expiresIn: "10h" }
    );

    // Password is correct, return success
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
};

// Get user Data
exports.getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, lastName, age, email } = req.body;
    const user = await User.findById(userId);
    
    if (!name && !lastName && !age && !email) {
        return res.status(400),json({message: "At least one field is required to update profile"})
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed update user profile" });
  }
};
