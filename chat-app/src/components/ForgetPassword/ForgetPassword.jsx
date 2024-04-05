import React, { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

const ForgetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5500/api/users/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        onClose(); // Close the modal after submitting
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

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
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </div>
      </form>
      {loading && <p>Sending password reset instructions...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPasswordModal;
