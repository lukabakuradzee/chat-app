import React, { useState } from 'react';
import {
  verify2FAToken,
  generate2FASecret,
} from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logInAction, twoFactorAuthSuccessAction } from '../../context/auth/actions';
import { useNavigate } from 'react-router-dom';
import { HOME_PAGE } from '../../constants/routes';

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
    setLoading(true);
    try {
      const response = await generate2FASecret(email);
      setSecret(response.secret);
      setQrCode(response.qrCode);
      setMessage(response.message);
      console.log('Response QR: ', response.qrCode);
      console.log('Response Secret: ', response.secret);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    try {
      const response = await verify2FAToken(token, secret, email);
      dispatch(twoFactorAuthSuccessAction(response.token))
      console.log("Response: ", response)
      setToken(response.message);
      navigate(HOME_PAGE);
      localStorage.setItem('accessToken', response.token)
      console.log("Response token: ", response.token)
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  if (loading) return <p>loading...</p>;

  return (
    <div style={{ marginTop: '2em' }}>
      <h1>Two-Factor Authentication Setup</h1>

      {/* Input for email */}
      <div>
        <h2>Enter your email:</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="on"
        />
      </div>

      <button onClick={handleGenerateSecret}>Generate 2FA Secret</button>

      {qrCode && (
        <div>
          <h2>Scan this QR Code with Google Authenticator:</h2>
          <img src={qrCode} alt="2FA QR Code" />
          {/* <QRCodeSVG value={secret} level='H'/> */}
        </div>
      )}

      <div>
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
