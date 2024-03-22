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
        <p>{user.iet}</p>
        <p>{user.exp}</p>
        <p>{user.userID}</p>
      </section>
    </div>
  );
};

export default UserInfo;
