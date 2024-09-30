const User = require("../models/User");
const asyncHandler = require('express-async-handler')
const dotenv = require('dotenv');
const { resendVerificationEmail } = require("../utils/email");

dotenv.config();


 exports.resendVerificationEmail = asyncHandler(async (req,res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId)

  if(!user) {
    return res.status(404).json({message: 'User not found'})
  }

  if(user.emailVerified) {
    return res.status(400).json({message: 'Email already verified'})
  }

  await resendVerificationEmail(user.email, user.verificationToken)
  return res.status(200).json({message: 'Verification email sent successfully'})
 })

