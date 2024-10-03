import React, { useState } from 'react';
import {
  verify2FAToken,
  generate2FASecret,
} from '../../api/services/userServices';
// import { QRCodeSVG } from 'qrcode.react';

function TwoFactorAuthentication() {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSecret = async () => {
    setLoading(true);
    try {
      const response = await generate2FASecret(email);
      setSecret(response.secret);
      setQrCode(response.qrCode);
      setMessage(response.message);
      console.log('Response QR: ', response.qrCode);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    try {
      const response = await verify2FAToken(token, secret);
      setToken(response.message);
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
        />
      </div>

      <button onClick={handleGenerateSecret}>Generate 2FA Secret</button>

      {qrCode && (
        <div>
          <h2>Scan this QR Code with Google Authenticator:</h2>
          {/* <img src={qrCode} alt="2FA QR Code" /> */}
          <img src={qrCode} />
        </div>
      )}

      <div>
        <h2>Enter the token from your Authenticator App:</h2>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter 2FA token"
        />
        <button onClick={handleVerifyToken}>Verify Token</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default TwoFactorAuthentication;
