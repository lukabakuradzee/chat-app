const sendVerificationEmail = require("../controllers/sendVerificationEmail");

// Register user email
const sendVerification = (email, verificationToken) => {
  const verificationLink = `${process.env.VERIFICATION_LINK}${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
            <h2>Email Verification</h2>
            <p>Thank you for creating an account. Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p style="margin-top: 20px;">If you did not create an account, please ignore this email.</p>
          </div>
        </div>
      `,
  };

  // Send Verification email
  return sendVerificationEmail(mailOptions, verificationLink);
};

//   Resend Verification Email
const resendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.VERIFICATION_LINK}${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
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
  return sendVerificationEmail(mailOptions);
};

// // Helper function: Send confirmation email after password change
const sendPasswordChangeConfirmation = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Successfully Changed",
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px; border-radius: 200px;">
            <h2>Password Successfully Changed</h2>
            <p>You are receiving this email because the password for your account: ${email} was successfully changed.</p>
            <p>If you did not make this change, please contact support immediately.</p>
          </div>
        </div>
      `,
  };

  await sendVerificationEmail(mailOptions);
};

// Delete user account
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

//  Reset Password Email

const sendResetPasswordEmail = async (email, resetPasswordLink) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Instructions",
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTebPMTK7aGkNZvnM-oiKB8lYC38YGPWG8KrzEB6-9z_mgThEpb" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2>Password Reset instructions</h2>
          <p>Please click the button to reset your account password:</p>
          <a href="${resetPasswordLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px;">Token will be valid for 1 hour.
          <p style="margin-top: 20px;">If you did not request this, please ignore this email and your password will remain unchanged</p>
        </div>
      </div>`,
  };
  return sendVerificationEmail(mailOptions);
};

const sendResetPassword = async (resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Instructions",
    html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p>https://localhost:3000/reset-password?token=${resetToken}</p>
            <p>Token will be valid for 1 hour.
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  // Send email
  await sendVerificationEmail(mailOptions);
};

// If email changed
const SendEmailChanged = async (user, req) => {
  const verificationLink = `${req.protocol}://localhost:3000/verify-email/${user.verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
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
  await sendVerificationEmail(mailOptions);
};

module.exports = {
  sendDeletionEmail,
  sendVerification,
  sendPasswordChangeConfirmation,
  sendResetPasswordEmail,
  resendVerificationEmail,
  sendResetPassword,
  SendEmailChanged,
};
