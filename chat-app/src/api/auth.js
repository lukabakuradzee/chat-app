const signUp = async (user) => {
  const url = 'http://localhost:5500/api/users/register';
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
  const url = 'http://localhost:5500/api/users/login';
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
  const url = `http://localhost:5500/api/users/update-profile/${userId}`;
  const token = localStorage.getItem('accessToken');

  
  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
    const url = `http://localhost:5500/api/users/verify-email/${token}`;
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
    
  
    


export { signUp, signIn, updateUserProfile, verifyEmailStatus };