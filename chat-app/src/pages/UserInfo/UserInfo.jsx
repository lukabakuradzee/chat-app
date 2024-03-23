import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const UserInfo = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div>
      <section>
        <p>UserName: {user.userName}</p>
        <p>Email: {user.email}</p>
        <p>Iat: {user.iat}</p>
        <p>Exp: {user.exp}</p>
        <p>User ID: {user.userID}</p>
      </section>
    </div>
  );
};

export default UserInfo;
