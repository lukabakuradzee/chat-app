import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { googleLogInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';



const GoogleSignInButton = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();


  const responseGoogle = (response) => {
    if (response.credential) {
      fetch('https://localhost:5500/api/users/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Response Credential: ', response.credential);
            dispatch(googleLogInAction({ token: data.token, user: data.user }));
            console.log('Token Data: ', data.token);
            console.log('User Data: ', data.user);
            navigate(HOME_PAGE);
          } else {
            console.error('Authentication failed:', data.message);
          }
        })
        .catch((err) => {
          console.error('Backend authentication error:', err);
        });
    } else {
      console.error('Google login failed: No credential found');
    }
  };

  const onFailure = (error) => {
    console.error('Google login failed', error);
  };

  return <GoogleLogin onSuccess={responseGoogle} onError={onFailure} />;
};

export default GoogleSignInButton;
