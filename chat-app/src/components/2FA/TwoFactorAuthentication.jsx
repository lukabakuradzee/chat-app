import React, { useState } from 'react';
import {
  verify2FAToken,
  generate2FASecret,
} from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logInAction } from '../../context/auth/actions';
import { useNavigate } from 'react-router-dom';
import { HOME_PAGE } from '../../constants/routes';
import { BarLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

function TwoFactorAuthentication() {
  const { dispatch } = useAuthContext();
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateSecret = async () => {
    if (!email) {
      setMessage('email is required to generate 2fa');
      return;
    }
    setLoading(true);
    try {
      const { secret, qrCode, message } = await generate2FASecret(email);
      setSecret(secret);
      setQrCode(qrCode);
      setMessage(message);
      console.log('Response QR: ', qrCode);
      console.log('Response Secret: ', secret);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = debounce(async () => {
    try {
      const response = await verify2FAToken(token, secret, email);
      dispatch(logInAction(response));
      setToken(response.message);
      navigate(HOME_PAGE);
      localStorage.setItem('accessToken', response.token);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }, 300);

  if (loading)
    return (
      <div className="bar-loader" style={{}}>
        <BarLoader color="#fe3c72" />
      </div>
    );

  return (
    <div className="twofactor-auth">
      <h1>Sign in via OTP</h1>

      {/* Input for email */}
      <div className="generate-qrcode-container">
        <h2>Enter your email:</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="on"
        />
      </div>

      <button onClick={handleGenerateSecret}>Generate QR Code</button>

      {qrCode && (
        <div>
          <h2>Scan this QR Code with Google Authenticator:</h2>
          <img src={qrCode} alt="2FA QR Code" />
          {/* <QRCodeSVG value={secret} level='H'/> */}
        </div>
      )}

      <div className="twofactor-digit-box">
        <h2>Enter the 6-digit OTP from your Authenticator App:</h2>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter the code"
        />
        <button onClick={handleVerifyToken}>Verify OTP</button>
      </div>

      {message && <p style={{ color: 'red', marginTop: '2em' }}>{message}</p>}
    </div>
  );
}

export default TwoFactorAuthentication;
