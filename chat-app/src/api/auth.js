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
      'Authorization': `Bearer ${token}`,
      
    },
    body: JSON.stringify(updateData),
    
  });
  console.log('Authorization header:', `Bearer ${token}`)
  

  // if(updateData.newPassword) {
  //   updateData = {
  //     ...updateData,
  //     newPassword: updateData.newPassword,
  //   }
  // }
  const data = await resp.json();
 
  if (resp.ok) {
    return data;
  } 

throw new Error("Failed to fetch data");

};

export { signUp, signIn, updateUserProfile };
