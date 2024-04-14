import React from 'react';
import { useLocation } from 'react-router';
import Form from '../../components/SignInForm/Form';

const SignIn = () => {
  const location = useLocation();
  const success = location?.state?.success;
  return (
    <div className="sign-in-page">
      <h2>
        Sign In <i className="fa-brands fa-microblog app-logo"></i>
      </h2>
      {success && <h1>You are successfully registered</h1>}
      <Form />
    </div>
  );
};

export default SignIn;
