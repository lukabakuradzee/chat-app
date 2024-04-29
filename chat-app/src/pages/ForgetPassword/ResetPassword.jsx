import React, { useState } from 'react';
import { passwordRegex } from '../../utils/Regex';
import { BarLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
     setShowPassword((prevShowPassword) => (!prevShowPassword));
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords Don't Match!");
        return;
      } else {
         setErrorMessage('')
      }

      if(!passwordRegex.test(newPassword)) {
        setErrorMessage("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.");
        return;
      }

    try {
      // Extract reset token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('token');
     
      const response = await fetch(
        `http://localhost:5500/api/users/set-new-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword, resetToken }),
        },
      );

      const data = await response.json();
      setMessage(data.message)
      setLoading(true);
      setTimeout(() => {
        navigate('/')
      }, 2000);
      setShowForm(false)
    } catch (error) {
      setMessage('Failed to change password');
      console.error(error);
    }
  };

  

  return (
    <div className="password-reset-container">
      <h2>Password Reset</h2>
      {showForm && (
      <form onSubmit={handleResetPassword} className="password-reset-form">
        <label htmlFor="newPassword">New Password:</label>
        <div className="password-reset-input">
        <i className="fa-solid fa-lock password-icon"></i>
        <input
          type={showPassword ? "text" : "password"}
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete='on'
        />
         {showPassword ? (
                <i
                  className="fa-solid fa-eye"
                  onClick={togglePasswordVisibility}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye-slash"
                  onClick={togglePasswordVisibility}
                ></i>
              )}
        </div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div className="password-reset-input">
        <i className="fa-solid fa-lock password-icon"></i>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete='on'
        />
         {showPassword ? (
                <i
                  className="fa-solid fa-eye"
                  onClick={togglePasswordVisibility}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye-slash"
                  onClick={togglePasswordVisibility}
                ></i>
              )}
        </div>
        
        {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
        <button type='submit' onClick={handleResetPassword}>Reset Password</button>
      </form>
      )}
      {errorMessage && <p>{errorMessage}</p> }
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
