import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import styles from '../UserProfile/user.module.scss';

const UserProfile = () => {
  const { state } = useAuthContext();
  const { user } = state;
  console.log(state)



    return (
      <div className={styles.userProfileContainer}>
        <p>User: {user.userName}</p>
        <p>Email: {user.email}</p>
        <p>ID: {user.userID}</p>
        <p>Exp: {user.exp}</p>
        <p>Iat: {user.iat}</p>
        </div>
    );
  };

export default UserProfile;
