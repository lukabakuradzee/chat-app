const dotenv = require("dotenv");
dotenv.config();

const reCaptchaGoogle = async (req, res) => {
  const { captchaToken } = req.body;
  const googleCaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
  console.log('google captcha security:, ', googleCaptchaSecretKey)

  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${googleCaptchaSecretKey}&response=${captchaToken}`;
    const response = await fetch(verificationURL, {
      method: "POST",
    });
    


    const data = await response.json();
    if(data.success) {
        return res.status(200).json({success: true, message: 'Captcha verified successfully'})
    } else {
        res.status(400).json({ success: false, message: 'Captcha verification failed' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error verifying captcha', error });
    }
};

module.exports = { reCaptchaGoogle };
