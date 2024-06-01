import React, { useState } from 'react';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import {
  sendVerificationSms,
  verifySmsCode,
} from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';

function SmsForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('')
  const [to, setTo] = useState('');
  const [code, setCode] = useState('');
  const [response, setResponse] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendSms = async (e, message) => {
    e.preventDefault();
    setLoading(true);
    await handleAsyncOperation(
      async () => {
        const data = await sendVerificationSms(to, message);
        setResponse(data.message);
        setCodeSent(true);
      },
      setLoading,
      (error) => setMessage(error.message),
    );
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleAsyncOperation(
      async () => {
        const data = await verifySmsCode(to, code);
        console.log("Response: ", data)
        setResponse(data);
      },
      setLoading, (error) => setMessage
       (error.message),
    );
  };

    return (
        <div>
          <h1>Send SMS</h1>
          {!codeSent ? (
            <form onSubmit={handleSendSms}>
              <div>
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Send SMS</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <div>
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Verify Code</button>
            </form>
          )}
    
          {message && <div>{JSON.stringify(message)}</div>}
          {error && <div>Error: {error}</div>}
          {loading && (
            <div className="bar-loader" style={{}}>
              <BarLoader color="#fe3c72" />
            </div>
          )}
        </div>
      );
    }

export default SmsForm;
