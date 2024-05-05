// Send verification Email
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    // configure your email provider
    service: "gmail",
    auth: {
      user: "lukabakuradze39@gmail.com",
      pass: "nomzlhdqzjxxhlms",
    },
  });

  // Compose email message
  const mailOptions = {
    from: "lukabakuradze39@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email, click on this link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email Send: ", info.response);
    }
  });
};

module.exports = sendVerificationEmail;
