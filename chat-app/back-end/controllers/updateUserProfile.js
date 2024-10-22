const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { SendEmailChanged } = require("../utils/email");
const { logActivity } = require("../services/activityLogService");

dotenv.config();

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username,
      name,
      lastName,
      age,
      email,
      phoneNumber,
      emailVerified,
      password,
    } = req.body;
    const user = await User.findById(userId);

    if (
      !username &&
      !name &&
      !lastName &&
      !age &&
      !email &&
      !emailVerified &&
      !password
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update profile" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check Field uniqueness
    const checkFieldUniqueness = async (field, value, userId, model, res) => {
      const existingUser = await model.findOne({ [field]: value });
      if (existingUser && existingUser._id.toString() !== userId) {
        res.status(403).json({ message: `${field} already exists` });
        return true;
      }
      return false;
    };

    // User name already exists
    if (
      username &&
      (await checkFieldUniqueness("username", username, userId, User, res))
    )
      return;

    // Phone number already exists
    if (
      phoneNumber &&
      (await checkFieldUniqueness(
        "phoneNumber",
        phoneNumber,
        userId,
        User,
        res
      ))
    )
      return;

    // Email number already exists
    if (
      email &&
      (await checkFieldUniqueness("email", email, userId, User, res))
    )
      return;

    // Check if the new email already exists in the database
    let emailChanged = false;
    if (email && user.email !== email) {
      emailChanged = true;
      user.email = email;
      user.emailVerified = false;
    }

    if (username) user.username = username;
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (password) {
      console.log("Password: ", password);
      console.log("User password: ", user.password);
      // Compare the new password with the current password
      const isSamePassword = await bcrypt.compare(password, user.password);
      console.log("Are password the same? :", isSamePassword);

      if (isSamePassword) {
        return res.status(403).json({
          message: "New password cannot be the same as the current password",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
    }
    await user.save();



    const updateData = await User.findById(userId);

    if (emailChanged) {
      await SendEmailChanged(email);
    }

    await logActivity(
      user._id,
      "user_profile_updated",
      "User profile updated successfully",
      req,
      200,
      'info',
    );

    const token = jwt.sign(
      {
        userId: user.id,
        userAvatar: user.avatar,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        gender: user.gender,
        emailVerified: user.emailVerified,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    if (!token) {
      res.status(404).json({ message: "Failed to generate token" });
    }

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

exports.updateUserBio = async (req, res) => {
  try {
    const { bio, gender } = req.body;
    console.log("Req body: ", req.body);
    const userId = req.user.userId;

    console.log("User Id: ", userId);

    const user = await User.findOneAndUpdate(
      { _id: userId }, 
      { bio, gender }, 
      { new: true } 
    );

    if(!user) {
      return res.status(404).json({message: "User not found"})
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userAvatar: user.avatar,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        gender: user.gender,
        emailVerified: user.emailVerified,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
   
    return res.status(200).json({ message: 'User bio updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: "Error updating user info" });
  }
};
