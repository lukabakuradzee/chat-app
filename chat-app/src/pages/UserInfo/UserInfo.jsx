import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { updateUserProfile } from '../../api/auth';
import { updateUserDataAction } from '../../context/auth/actions';

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
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(user.userId, formData);
      dispatch(updateUserDataAction(formData));
      setMessage('Successfully updated profile information');
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

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
            />
          </div>
        ))}
        <button type="submit">Save Changes</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserInfo;
