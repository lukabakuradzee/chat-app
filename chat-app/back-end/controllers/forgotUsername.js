const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { sendReminderEmail } = require("../utils/email");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  return user;
};

exports.forgotUsername = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("Req body: ", req.body);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await findUserByEmail(email);
  if(!user) {
    return res.status(404).json({message: "User with corresponding email does not exist"})
  }

  await sendReminderEmail(user);
  return res.status(200).json({ message: "Username reminder sent to email" });
});
