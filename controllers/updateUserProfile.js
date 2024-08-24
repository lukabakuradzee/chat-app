const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const sendVerificationEmail = require("./sendVerificationEmail");

dotenv.config();

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, name, lastName, age, email, emailVerified, password } =
      req.body;
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

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(403).json({ message: "Username already exists" });
      }
    }

    // Check if the new email already exists in the database
    let emailChanged = false;
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(403).json({
          message:
            "User with provided email exists, please choose another email address",
        });
      }
      if (user.email !== email) {
        emailChanged = true;
        user.email = email;
        user.emailVerified = false;
      }
    }

    if (username) user.username = username;
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(403).json({
          message:
            "You cannot set the same password, please choose the new one",
        });
      }
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

    if (emailChanged) {
      const verificationLink = `${req.protocol}://localhost:3000/verify-email/${user.verificationToken}`;
      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: user.email,
        subject: "Email Changed",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
              <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
              <p style="margin-top: 20px;">Your email address was changed to ${user.email}, if you haven't verified this new email address yet, please click the following link
              <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
              </p>
              <p style="margin-top: 20px;">If you did not request email verification, please ignore this email.</p>
              
            </div>
          </div>
        `,
      };
      await sendVerificationEmail(mailOptions, verificationLink);
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
