const signUp = async (user) => {
  const url =
    'http://localhost:5500/api/users/register';
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
  const url =
    'http://localhost:5500/api/users/login';
    console.log(url);
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

export { signUp, signIn };
