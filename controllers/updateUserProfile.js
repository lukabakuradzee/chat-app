const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, name, lastName, age, email, emailVerified, password } =
      req.body;
    const user = await User.findById(userId);

    if (!username && !name && !lastName && !age && !email && !password) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update profile" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(403).json({ message: "Username already exists" });
      }
    }

    // Check if the new email already exists in the database
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(403).json({
          message:
            "User with provided email exists, please choose another email address",
        });
      }
      user.email = email;
      user.emailVerified = false;

    }

    if (username) user.username = username;
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const updateData = await User.findById(userId);
    console.log("Update Data", updateData);

    const token = jwt.sign(
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

    if (!token) {
      res.status(500).json({ message: "Failed to generate new token" });
    }
    console.log("Generated new token: ", token);

    res.status(200).json({
      message: "User profile updated successfully",
      updateData,
      token,
    });
    console.log("Updated user :", updateData);
  } catch (error) {
    res.status(500).json({ message: "Failed update user profile" });
  }
};
