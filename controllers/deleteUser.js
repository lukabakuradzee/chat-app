const User = require("../models/User");
const dotenv = require("dotenv");
const sendVerificationEmail = require("./sendVerificationEmail");

dotenv.config();


exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email;

    await User.findOneAndDelete(userId)

    const mailOptions = {
      from: "lukabakuradze39@gmail.com",
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
    await sendVerificationEmail(mailOptions);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error while deleting", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
