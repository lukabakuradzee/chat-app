import React, { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { resetPasswordRequest } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';

const ForgetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
          await resetPasswordRequest(email);
          setMessage('Password reset link sent successfully')
        } catch (error) {
          setMessage(error.message)
        } finally {
          setLoading(false)
          setTimeout(() => {
            onClose();
          }, 500);
        }
      }

  useEscapeKeyHandler(onClose);

  return (
    <div className="password-reset-modal">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <form onSubmit={handleSubmit}>
        <div className="password-reset-request-input">
          <label htmlFor="email">Recovery Email</label>
          <i className="fa-solid fa-envelope user-email"></i>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="on"
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </div>
        <div>
          {loading && (
            <div className="bar-loader" style={{}}>
              <BarLoader color="#fe3c72" />
            </div>
          )}
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};


export default ForgetPasswordModal;
