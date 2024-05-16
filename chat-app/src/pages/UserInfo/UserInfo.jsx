
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction, updateUserDataAction } from '../../context/auth/actions';
import { useNavigate } from 'react-router-dom';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { LogoutButton } from '../Home/SettingsMenu';
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  deleteAccountService,
  resendVerification
} from '../../api/services/userServices';

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
    const file = e.target.files[0]; // Fix here
    if (file) {
      setAvatar(file);
    }
    console.log('File: ', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(user.userId, formData, passwordData);
      dispatch(updateUserDataAction(result.updatedData));
      setMessage(result.message);
      if (result.message.includes('Password updated')) {
        setPasswordData({ newPassword: '', confirmPassword: '' });
      }
      console.log('Updated Data :', result.updatedData);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      setMessage(error.message);
      return;
    }
  };

  const handleUploadAvatar = async (e) => {
    try {
      const result = await uploadAvatar(avatar);
      setTimeout(() => {
        setShowAttachmentBox(!showAttachmentBox);
      }, 1000);
      setSuccessUploadMessage(result.message);
      console.log('Avatar upload response:', result.data);
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      setMessage(error.message);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const result = await deleteAvatar(user.userId);
      setSuccessUploadMessage(result.message);
      console.log('Avatar delete response:', result.data);
    } catch (error) {
      console.error('Error while deleting profile picture', error.message);
      setMessage(error.message);
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
      await deleteAccountService(user.userId);
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
      await resendVerification(token);
      setMessage('Email verification sent');
    } catch (error) {
      console.error('Failed to send verification email', error);
      setMessage(error.message);
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
          <img
            src={avatar ? URL.createObjectURL(avatar) : user.userAvatar}
            alt="Change Avatar"
          />
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
      <LogoutButton dispatch={dispatch} />
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
            <button onClick={handleDeleteAvatar}>Delete Photo</button>

            {successUploadMessage && <p>{successUploadMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
