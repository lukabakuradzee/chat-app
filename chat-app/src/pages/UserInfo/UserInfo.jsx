import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { resendVerificationEmail, updateUserProfile } from '../../api/auth';
import { logOutAction, updateUserDataAction } from '../../context/auth/actions';
import { passwordRegex } from '../../utils/Regex';
import { deleteAccount } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import LazyLoad from 'react-lazyload';
import { LogoutButton } from '../Home/SettingsMenu';

const UserInfo = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [message, setMessage] = useState('');
  const [successUploadMessage, setSuccessUploadMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user.name || '',
    lastName: user.lastName || '',
    age: user.age || '',
    email: user.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [showAttachmentBox, setShowAttachmentBox] = useState(false);
  const navigate = useNavigate();

  const handleAttachmentBoxToggle = () => {
    setShowAttachmentBox(!showAttachmentBox);
  };

  useEscapeKeyHandler(() => {
    setShowAttachmentBox(false);
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    e.stopPropagation();
    const file = setAvatar(e.target.files[0]); // Set the selected avatar file
    if (file) {
      setAvatar(file);
    }
  };

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
          throw new Error(
            'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
          );
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
        setPasswordData({ newPassword: '', confirmPassword: '' });
        console.log('Updated Data :', updatedData);
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
      setMessage(error.message);
      return;
    }
  };

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromStorage) {
      setFormData({
        name: userFromStorage.name || '',
        lastName: userFromStorage.lastName || '',
        age: userFromStorage.age || '',
        email: userFromStorage.email || '',
      });
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this account?',
    );
    if (!confirmed) return;

    try {
      await deleteAccount(user.userId);
      setTimeout(() => {
        dispatch(logOutAction());
        navigate('/');
      }, 2000);
      setMessage('Account deleted successfully');
    } catch (error) {
      console.error('Failed to delete account', error);
      setMessage(error.message);
    }
  };

  const handleResendVerification = async (token) => {
    try {
      await resendVerificationEmail(token);
      setMessage('Email verification sent');
    } catch (error) {
      console.error('Failed to send verification email', error);
      setMessage(error.message);
    }
  };

  const handleUploadAvatar = async (e) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      console.log('FORM DATA');

      const response = await fetch('http://localhost:5500/api/users/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error uploading avatar :', errorData);
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      const updatedUser = data.user;
      

      dispatch(updateUserDataAction(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log("Updated Data: ", updatedUser)

      // Avatar uploaded successfully
      setTimeout(() => {
        setShowAttachmentBox(!showAttachmentBox);
      }, 1000);
      setSuccessUploadMessage('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

  console.log('User avatar:', user.userAvatar);

  return (
    <div className="user-info-modal-wrapper">
      <form onSubmit={handleSubmit}>
        <div
          className="user-photo-header"
          onClick={handleAttachmentBoxToggle}
          title="Click to change profile picture"
        >
          <LazyLoad height={200} offset={100} once>
            <img
              src={avatar ? URL.createObjectURL(avatar) : user.userAvatar}
              alt="Profile"
            />
          </LazyLoad>

          <h1>{user.username}</h1>
        </div>
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
              <i
                className="fa-solid fa-circle-xmark"
                onClick={handleResendVerification}
              ></i>
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
              autoComplete="true"
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
              autoComplete="true"
            />
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <button className="delete-account-button" onClick={handleDeleteAccount}>
        Delete Account
      </button>
      <LogoutButton dispatch={dispatch}/>
      {message && <p>{message}</p>}
      {showAttachmentBox && (
        <div className="page-overlay">
          <div className="attachment-user-photo-box">
            <h3>Change Profile Photo</h3>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <button onClick={handleUploadAvatar}>Upload Photo</button>
            
            {successUploadMessage && <p>{successUploadMessage}</p>}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default UserInfo;
