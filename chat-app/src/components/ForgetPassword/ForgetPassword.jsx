import React, { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { resetPasswordRequest } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import styles from '../ForgetPassword/ForgetPassword.module.scss';

const ForgetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordRequest(email);
      setMessage('Password reset link sent successfully');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  useEscapeKeyHandler(onClose);

  return (
    <div className={styles.modal}>
      <span className={styles.close} onClick={onClose}>
        &times;
      </span>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Recovery Email</label>
          <i className={`fa-solid fa-envelope ${styles.envelope_icon}`}></i>
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
      </form>
      {loading && (
        <div
          className="bar-loader"
          style={{ width: '50%', display: 'flex', placeItems: 'center', marginInline: 'auto'}}
        >
          <BarLoader color="#fe3c72" />
        </div>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ForgetPasswordModal;
