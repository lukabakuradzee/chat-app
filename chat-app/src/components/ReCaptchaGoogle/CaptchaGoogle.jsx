import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyCaptcha } from '../../api/services/userServices';

function CaptchaGoogle() {
  const [captchaValue, setCaptchaValue] = useState(null);

  const onCaptchaChange = async (value) => {
    setCaptchaValue(value);
    try {
      await verifyCaptcha(value);
    } catch (error) {
      console.error('Error verifying captcha', error);
    }
  };

  console.log('Captcha site key: ', process.env.REACT_APP_CAPTCHA_SITE_KEY)

  return (
    <div>
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
        onChange={onCaptchaChange}
      />
    </div>
  );
}

export default CaptchaGoogle;
