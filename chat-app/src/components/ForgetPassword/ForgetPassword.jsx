import React, { useState } from 'react';

const ForgetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Subbmiting')
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
      )
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        onClose(); // Close the modal after submitting
        console.log(data);
      } else {
        setMessage('Failed to send password reset instructions');
      }
    } catch (error) {
      setMessage('Failed to send password reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-modal">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Recovery Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Submit
        </button>
        {loading && <p>Sending password reset instructions...</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ForgetPasswordModal;
