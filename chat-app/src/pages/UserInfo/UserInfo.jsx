import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction, updateUserDataAction } from '../../context/auth/actions';
import { useNavigate } from 'react-router-dom';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  deleteAccountService,
  resendVerification,
} from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserInfo = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [successUploadMessage, setSuccessUploadMessage] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [showAttachmentBox, setShowAttachmentBox] = useState(false);
  const navigate = useNavigate();

  const formikProfile = useFormik({
    initialValues: {
      username: user.username || '',
      name: user.name || '',
      lastName: user.lastName || '',
      age: user.age || '',
      email: user.email || '',
      phone: user.phoneNumber || '+',
      emailVerified: user.emailVerified || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      lastName: Yup.string().required('Last name is required'),
      age: Yup.number().required('Age is required').positive().integer(),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string().matches(
        /^\+[1-9]\d{1,14}$/,
        'Phone number must start with + and contain only digits',
      ),
    }),
    onSubmit: async (values) => {
      await handleAsyncOperation(
        async () => {
          const result = await updateProfile(user.userId, values, {});
          dispatch(updateUserDataAction(result.updatedData));
          setMessage(result.message);
        },
        setLoading,
        (error) => setError(error.message),
      );
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, 'Password must contain at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(
          /[@$!%*?&#]/,
          'Password must contain at least one special character',
        ),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        "Passwords don't match",
      ),
    }),
    onSubmit: async (values) => {
      await handleAsyncOperation(
        async () => {
          const result = await updateProfile(user.userId, values, {
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          });
          setMessage(result.message);
          if (result.message.includes('Password updated')) {
            formikPassword.resetForm();
          }
        },
        setLoading,
        (error) => setError(error.message),
      );
    },
  });

  const handleAttachmentBoxToggle = () => {
    setShowAttachmentBox(!showAttachmentBox);
  };

  useEffect(() => {
    if (user) {
      formikProfile.setValues({
        username: user.username || '',
        name: user.name || '',
        lastName: user.lastName || '',
        age: user.age || '',
        email: user.email || '',
        phone: user.phoneNumber || '+',
      });
    }

    console.log('USER FORMIK: ', user);
  }, [user, state]);

  useEscapeKeyHandler(() => {
    setShowAttachmentBox(false);
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleUploadAvatar = async () => {
    await handleAsyncOperation(
      async () => {
        const result = await uploadAvatar(avatar);
        setTimeout(() => {
          setShowAttachmentBox(false);
        }, 1000);
        setSuccessUploadMessage(result.message);
      },
      setLoading,
      (error) => setError(error.message),
    );
  };

  const handleDeleteAvatar = async () => {
    await handleAsyncOperation(
      async () => {
        const result = await deleteAvatar(user.userId);
        setSuccessUploadMessage(result.message);
      },
      setLoading,
      (error) => setError(error.message),
    );
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this account?',
    );
    if (!confirmed) return;

    await handleAsyncOperation(
      async () => {
        await deleteAccountService(user.userId);
        setTimeout(() => {
          dispatch(logOutAction());
          navigate('/');
        }, 2000);
        setMessage('Account deleted successfully');
      },
      setLoading,
      (error) => setError(error.message),
    );
  };

  const handleResendVerification = async () => {
    await handleAsyncOperation(
      async () => {
        await resendVerification();
        setMessage('Email verification sent');
      },
      setLoading,
      (error) => setError(error.message),
    );
  };

  return (
    <div className="user-info-modal-wrapper">
      <form onSubmit={formikProfile.handleSubmit}>
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
        {Object.entries(formikProfile.values).map(([key, value]) => (
          <div className="form-inputs-update-profile" key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type={key.includes('Password') ? 'password' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={formikProfile.handleChange}
              onBlur={formikProfile.handleBlur}
              // disabled={key === 'username'}
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
        <button type="submit">Save Changes</button>
      </form>

      <form onSubmit={formikPassword.handleSubmit}>
        <div className="password-section">
          <div className="form-inputs-update-profile">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formikPassword.values.newPassword}
              onChange={formikPassword.handleChange}
              onBlur={formikPassword.handleBlur}
              autoComplete="true"
            />
          </div>
          <div className="form-inputs-update-profile">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formikPassword.values.confirmPassword}
              onChange={formikPassword.handleChange}
              onBlur={formikPassword.handleBlur}
              autoComplete="true"
            />
          </div>
        </div>
        <button type="submit">Change Password</button>
        {formikPassword.touched.newPassword &&
        formikPassword.errors.newPassword ? (
          <div className="errorFormMessage">
            {formikPassword.errors.newPassword}
          </div>
        ) : null}
        {formikPassword.touched.confirmPassword &&
        formikPassword.errors.confirmPassword ? (
          <div className="errorFormMessage">
            {formikPassword.errors.confirmPassword}
          </div>
        ) : null}
      </form>

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

      <button className="delete-account-button" onClick={handleDeleteAccount}>
        Delete Account
      </button>
      <LogoutButton dispatch={dispatch} />
      {message && <p>{message}</p>}
      <div style={{ marginTop: '1em', fontSize: '1.2rem' }}>
        {error && <h2>{error}</h2>}
        {loading && (
          <div className="bar-loader">
            <BarLoader color="#fe3c72" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
