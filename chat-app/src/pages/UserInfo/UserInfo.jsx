import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { updateUserProfile } from '../../api/auth';
import { updateUserDataAction } from '../../context/auth/actions';
import { passwordRegex } from '../../utils/Regex';

const UserInfo = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: user.username || '',
    name: user.name || '',
    lastName: user.lastName || '',
    age: user.age || '',
    email: user.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

const handlePasswordChange = useCallback((e) => {
  const {name, value} = e.target;
  setPasswordData((prevPasswordData) => ({
    ...prevPasswordData,
    [name]: value,
  }))
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
          // Check if newPassword and confirmPassword are both empty
    if (!passwordData.newPassword && !passwordData.confirmPassword) {
      // Update profile information without password change
      const updatedData = { ...formData };
      await updateUserProfile(user.userId, updatedData);
      dispatch(updateUserDataAction(updatedData));
      setMessage('Successfully updated profile information');
    } else {
      // Perform password validation if newPassword or confirmPassword is not empty
      if (!passwordRegex.test(passwordData.newPassword)) {
        throw new Error('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character');
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Update profile information with password change
      const updatedData = {
        ...formData,
        password: passwordData.newPassword,
      };
      await updateUserProfile(user.userId, updatedData);
      dispatch(updateUserDataAction(updatedData));
      setMessage('Password updated successfully');
      setPasswordData({newPassword: '', confirmPassword: '',})
    }

    } catch (error) {
      console.error('Failed to update user profile:', error);
      setMessage(error.message)
      return;
    }
  };


  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromStorage) {
      setFormData({
        username: userFromStorage.username || '',
        name: userFromStorage.name || '',
        lastName: userFromStorage.lastName || '',
        age: userFromStorage.age || '',
        email: userFromStorage.email || '',
      });
    }
  }, [user]);


  return (
    <div className="user-info-modal-wrapper">
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div className="form-inputs-update-profile" key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type={key.includes('Password') ? 'password' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              disabled={key === 'username'}
              autoComplete={key === 'password' ? 'on' : 'off'}
            />
             {key === 'email' && !user.emailVerified && (
              <i className="fa-solid fa-circle-xmark"></i>
            )}
            {key === 'email' && user.emailVerified && (
              <i className="fa-solid fa-circle-check"></i>
            )}
          </div>
        ))}
        <div className="password-section">
          <div className="form-inputs-update-profile">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              autoComplete='true'
            />
          </div>
          <div className="form-inputs-update-profile">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              autoComplete='true'
            />
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserInfo;
