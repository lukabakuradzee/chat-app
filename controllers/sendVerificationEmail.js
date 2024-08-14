const nodemailer = require("nodemailer");
require("dotenv").config()

const sendVerificationEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lukabakuradze39@gmail.com",
      pass: process.env.GMAIL_KEY,
    },
  });


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email Send: ", info.response);
    }
  });
};

module.exports = sendVerificationEmail;
