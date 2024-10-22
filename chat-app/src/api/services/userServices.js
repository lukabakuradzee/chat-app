import {
  updateUserProfile,
  deleteAccount,
  resendVerificationEmail,
} from '../../api/auth';
import { passwordRegex } from '../../utils/Regex';
import { getAuthHeaders } from '../../helpers/authHelpers';

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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
  const data = await response.json();
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

export const verifySmsCode = async (phoneNumber, verificationCode, token) => {
  const url = `https://localhost:5500/api/users/verify-sms`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phoneNumber, code: verificationCode, token }),
    });

    const responseText = await response.text(); // Get the raw response text
    console.log('Response:', responseText); // Log the raw response

    if (response.ok) {
      localStorage.setItem('accessToken', response.token);
      return JSON.parse(responseText);
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
      headers: getAuthHeaders(),
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

export const fetchUserPosts = async (userId) => {
  const url = `https://localhost:5500/api/users/posts/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error('Failed to fetch user posts', +error.message);
  }
};

export const deleteUserPosts = async (postId) => {
  const url = `https://localhost:5500/api/users/delete-post/${postId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error('Error deleting user post', +error);
  }
};

export const fetchUserFollowers = async (userId) => {
  const url = `https://localhost:5500/api/users/followers/${userId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  console.log('Followers data: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error('Error fetch user followers');
};

export const fetchFollowingUsers = async (userId) => {
  const url = `https://localhost:5500/api/users/following/${userId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  console.log('FOLLOWING USERS DATA: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error('Error fetch user followings');
};

export const userLikes = async (postId, userId) => {
  const url = `https://localhost:5500/api/users/posts/${postId}/like`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  console.log('Response data:', data); // Log the entire response data
  if (response.ok) {
    return data;
  }
  throw new Error('Error like post');
};

export const getUserLikes = async (postId) => {
  const url = `https://localhost:5500/api/users/posts/${postId}/likes`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Error fetch user likes');
};

export const postUserComment = async (postId, userId, text) => {
  const url = `https://localhost:5500/api/users/posts/${postId}/comments`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ postId, userId, text }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  console.log('Data comments: ', data);
  throw new Error('Error posting comments');
};

export const getUserComment = async (postId) => {
  const url = `https://localhost:5500/api/users/posts/${postId}/comments`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Error while fetching comments');
};

export const deleteUserComment = async (postId, commentId) => {
  const url = `https://localhost:5500/api/users/posts/${postId}/comments/${commentId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers:getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Error while deleting comment');
};

// userServices.js
export const getUserProfile = async (username) => {
  const response = await fetch(`https://localhost:5500/api/users/${username}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('User profile not found');
};

export const getUserPosts = async (username) => {
  const response = await fetch(
    `https://localhost:5500/api/users/${username}/posts`,
    {
      headers: getAuthHeaders(),
    },
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Error getting user posts');
};

export const getUserFollower = async (username) => {
  const url = `https://localhost:5500/api/users/${username}/followers`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  console.log('FOLLOWER DATA: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error('Error fetch user followers');
};

export const getUserFollowing = async (username) => {
  const url = `https://localhost:5500/api/users/${username}/following`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  console.log('FOLLOWING DATA: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error('Error fetch user followers');
};

export const userFollow = async (userId) => {
  const url = `https://localhost:5500/api/users/follow/${userId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Failed following user');
};

export const userUnFollow = async (userId) => {
  const url = `https://localhost:5500/api/users/unfollow/${userId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Failed unfollow user');
};

export const fetchFollowStatus = async (username) => {
  const url = `https://localhost:5500/api/users/${username}/follow-status`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error('Failed to fetch user follow status');
};

export const userNotification = async () => {
  const url = `https://localhost:5500/api/users/notifications`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  console.log('USER NOTIFICATION DATA: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error(data.message);
};

export const notificationRead = async (notificationIds) => {
  const url = `https://localhost:5500/api/users/notifications/markAsRead`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notificationIds }),
  });
  const data = await response.json();
  console.log('Notification mark data: ', data);
  if (response.ok) {
    return data;
  }
  throw new Error("Couldn't mark as read notification");
};

export const forgotUsername = async (email) => {
  const url = 'https://localhost:5500/api/users/forgot-username';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await resp.json();
  console.log('Data: ', data);
  if (resp.ok) {
    return data;
  }

  throw new Error(data.message);
};

export const generate2FASecret = async (email) => {
  const url = 'https://localhost:5500/api/users/generate-2fa-secret';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }

  throw new Error(data.message);
};

export const verify2FAToken = async (token, secret, email) => {
  const url = `https://localhost:5500/api/users/verify-2a`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, secret, email }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data.message);
};
