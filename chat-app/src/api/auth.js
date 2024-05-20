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

  const data = await resp.json();

  if(resp.ok) {
    return data;
  }
    throw new Error('Error fetching data');
  }

  const verifyEmailStatus = async (token) => {
    const url = `https://localhost:5500/api/users/verify-email/${token}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
        }
      })

      const data = await resp.json();

      if(resp.ok) {
        return data;
      }
      throw new Error("Error fetching data");
    }

    const resendVerificationEmail = async () => {
      const url = `https://localhost:5500/api/users/resend-verification`
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      })
      const data = await resp.json();

      if(resp.ok) {
        return data;
      }

      throw new Error("Error fetching resend verification")
    }

    const deleteAccount = async (userId) => {
      const url = `https://localhost:5500/api/users/delete/${userId}`;

      const resp = await fetch(url, {
        method: "DELETE",
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      
      const data = await resp.json();
      console.log("data received delete account: ", data)
      if(resp.ok) {
        return data;
      }
      throw new Error("Error fetching data")
    }
    
    const userProfileAvatar = async () => {
      const url = "https://localhost:5500/api/users/uploads";
      const token = localStorage.getItem('accessToken');

      const resp = await fetch(url, {
        headers: {
          "Content-type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await resp.json();
      if(resp.ok) {
        return data;
      }
      throw new Error("Error fetch upload data")
    }
  
    


export { signUp, signIn, updateUserProfile, verifyEmailStatus, deleteAccount, resendVerificationEmail, userProfileAvatar };