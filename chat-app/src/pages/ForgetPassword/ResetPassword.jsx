import React, { useState } from 'react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');


  const handleResetPassword = async (e) => {
    e.preventDefault();
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords Don't Match!");
        return;
      } else {
         setErrorMessage('')
      }

    try {
     
      const response = await fetch(
        `http://localhost:5500/api/users/set-new-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      const data = await response.json();
      setMessage(data.message)
    } catch (error) {
      setMessage('Failed to reset password');
      console.error(error);
    }
  };

  

  return (
    <div className="password-reset-container">
      <h2>Password Reset</h2>
      <form className="password-reset-form">
        <label htmlFor="newPassword">New Password:</label>
        <div className="password-reset-input">
        <i className="fa-solid fa-lock password-icon"></i>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
       

        </div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div className="password-reset-input">
        <i className="fa-solid fa-lock password-icon"></i>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        </div>
        <button type='submit' onClick={handleResetPassword}>Reset Password</button>
      </form>
      {errorMessage && <p>{errorMessage}</p> }
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
