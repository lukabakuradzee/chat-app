import {
  updateUserProfile,
  deleteAccount,
  resendVerificationEmail,
} from '../../api/auth';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { passwordRegex } from '../../utils/Regex';

export const updateProfile = async (userId, formData, passwordData) => {
  if (!passwordData.newPassword && !passwordData.confirmPassword) {
    // Update profile information without password change
    const updatedData = { ...formData };
    await updateUserProfile(userId, updatedData);
    return { message: 'Successfully updated profile information', updatedData };
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
    await updateUserProfile(userId, updatedData);
    return { message: 'Password updated successfully', updatedData };
  }
};

export const uploadAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response = await fetch('https://localhost:5500/api/users/uploads', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    return { message: 'Photo uploaded', data };
  }

  throw new Error('Failed to upload avatar');
};

export const deleteAvatar = async (userId) => {
  const url = `https://localhost:5500/api/users/delete-avatar/${userId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return { message: 'Profile photo deleted', data };
  }
  throw new Error('Error deleting profile picture');
};

export const deleteAccountService = async (userId) => {
  await deleteAccount(userId);
};

export const resendVerification = async (token) => {
  await resendVerificationEmail(token);
};

export const resetPasswordRequest = async (email) => {
  const url = `https://localhost:5500/api/users/reset-password`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data.message);
};

export const sendVerificationSms = async (to, message) => {
  const url = `https://localhost:5500/api/users/send-verification-sms`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, message }),
  });
  const data = response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data.message);
};

export const verifySmsCode = async (to, code) => {
  const url = `https://localhost:5500/api/users/verify-sms`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, code }),
    });

    const responseText = await response.text(); // Get the raw response text
    console.log('Response:', responseText); // Log the raw response

    if (response.ok) {
      return JSON.parse(responseText); // Parse the response as JSON
    } else {
      throw new Error(responseText); // Throw an error with the raw response text
    }
  } catch (error) {
    console.error('Error verifying SMS:', error);
    throw new Error('Error verifying SMS');
  }
};

export const createNewPost = async (postData) => {
  const url = `https://localhost:5500/api/users/posts`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: postData,
    });
    console.log('Post Data: ', postData);
    const data = response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to create post');
  }
};

