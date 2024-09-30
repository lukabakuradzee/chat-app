const User = require("../models/User");
const dotenv = require("dotenv");
const asyncHandler = require('express-async-handler');
const { sendDeletionEmail } = require("../utils/email");

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


exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.userId);
  await deleteUserById(user._id);
  await sendDeletionEmail(user.email);

  return res.status(200).json({ message: "User deleted successfully" });
});
