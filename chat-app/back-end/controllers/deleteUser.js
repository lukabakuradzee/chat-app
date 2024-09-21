const User = require("../models/User");
const dotenv = require("dotenv");
const sendVerificationEmail = require("./sendVerificationEmail");
const asyncHandler = require('express-async-handler')

dotenv.config();

const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return user;
};

const deleteUserById = async (userId) => {
  return User.deleteOne({ _id: userId });
};

const sendDeletionEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your account has been deleted",
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
        <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h2>You are receiving this email because you (or someone else) has deleted your account. </h2>
        <p style="margin-top: 20px;">If you did not delete an account, please ignore this email.</p>
      </div>
    </div>
  `,
  };
  return sendVerificationEmail(mailOptions);
};

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.userId);
  await deleteUserById(user._id);
  await sendDeletionEmail(user.email);

  return res.status(200).json({ message: "User deleted successfully" });
});
