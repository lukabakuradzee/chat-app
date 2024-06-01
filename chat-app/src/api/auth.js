const signUp = async (user) => {
  const url = 'https://localhost:5500/api/users/register';
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await resp.json();
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const signIn = async (user) => {
  const url = 'https://localhost:5500/api/users/login';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const data = await resp.json();
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const updateUserProfile = async (userId, updateData) => {
  const url = `https://localhost:5500/api/users/update-profile/${userId}`;

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(updateData),
  });
  console.log("Updated Data: ", updateData)

  const data = await resp.json();

  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const verifyEmailStatus = async (token) => {
  const url = `https://localhost:5500/api/users/verify-email/${token}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await resp.json();

  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const resendVerificationEmail = async () => {
  const url = `https://localhost:5500/api/users/resend-verification`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const data = await resp.json();

  if (resp.ok) {
    return data;
  }

  throw new Error(data.message);
};

const deleteAccount = async (userId) => {
  const url = `https://localhost:5500/api/users/delete/${userId}`;

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  const data = await resp.json();
  console.log('data received delete account: ', data);
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const userProfileAvatar = async () => {
  const url = 'https://localhost:5500/api/users/uploads';
  const token = localStorage.getItem('accessToken');

  const resp = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await resp.json();
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const authGoogle = async (token) => {
  const url = 'https://localhost:5500/api/users/auth/google';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  const data = await resp.json();
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

const resetPassword = async (newPassword) => {
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token');

  if(!resetToken) {
    throw new Error("Reset Token is Missing")
  }

    const url = `https://localhost:5500/api/users/set-new-password`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword, resetToken }),

  });
  const data = await resp.json();
  if (resp.ok) {
    return data;
  }
  throw new Error(data.message);
};

export {
  signUp,
  signIn,
  authGoogle,
  updateUserProfile,
  verifyEmailStatus,
  deleteAccount,
  resendVerificationEmail,
  userProfileAvatar,
  resetPassword,
};
