import React from 'react';
import { useLocation } from 'react-router';
import Form from '../../components/SignInForm/Form';


const SignIn = () => {
  const location = useLocation();
  const success = location?.state?.success;
  return (
    <div className="sign-in-page">
      <h2>Sign In</h2>
      {success && <h1>succesfuly registred</h1>}
      <Form />
    </div>
  );
};

export default SignIn;
