import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const UserInfo = () => {
  const { state } = useAuthContext();
  const { user } = state;
  console.log(state);
  console.log(user.age);

  return (
    <div>
      <section>
        <p>User ID: {user.userId}</p>
        <p>UserName: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Age {user.age}</p>
        <p>Email: {user.email}</p>
        <p>Iat: {user.iat}</p>
        <p>Exp: {user.exp}</p>
      </section>
    </div>
  );
};

export default UserInfo;
