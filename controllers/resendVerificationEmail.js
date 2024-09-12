const User = require("../models/User");
const sendVerificationEmail = require("./sendVerificationEmail");

exports.resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationLink = `${req.protocol}://localhost:3000/verify-email/${user.verificationToken}`;

      const mailOptions = {
        from: "lukabakuradze39@gmail.com",
        to: user.email,
        subject: "Email Verification",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
              <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
              <h2>Email Verification</h2>
              <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p style="margin-top: 20px;">If you did not request email verification, please ignore this email.</p>
            </div>
          </div>
        `,
      };
    

    await sendVerificationEmail(mailOptions, verificationLink);
    res.status(200).json({ message: "Verification email sent successfully" });
    console.log("USER EMAIL", user.email)
  } catch (error) {
    console.error("Error sending verification email", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
