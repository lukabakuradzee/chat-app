import React from 'react';
import { useAuthContext } from '../context/auth/AuthContextProvider';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '../constants/routes';
import { Link } from 'react-router-dom';

function AuthGuard({ children }) {
  const { state } = useAuthContext();
  return (
    <>
      {state.isAuthenticated ? (
        children
      ) : (
        <div className="account-modal-content">
          <span>
            <i className="fa-solid fa-fingerprint user-fingerprint"></i>
          </span>
          <h3>Sign in with Touch ID</h3>
          <p>Use your Touch ID for faster, easier access to your account.</p>
          <Link to={SIGN_IN_PAGE}>
            <button className="log-in-button">Login with Email</button>
          </Link>
          <Link to={SIGN_UP_PAGE}>
            <button className="sign-up-button">New User? Sign Up</button>
          </Link>
        </div>
      )}
    </>
  );
}

export default AuthGuard;