import {
  updateUserProfile,
  deleteAccount,
  resendVerificationEmail,
} from '../../api/auth';
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

  const response = await fetch('http://localhost:5500/api/users/uploads', {
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
  const url = `http://localhost:5500/api/users/delete-avatar/${userId}`;
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
