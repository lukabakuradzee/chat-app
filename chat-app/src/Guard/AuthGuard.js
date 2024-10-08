import React, { useState } from 'react';
import { useAuthContext } from '../context/auth/AuthContextProvider';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '../constants/routes';
import { Link } from 'react-router-dom';
import ForgetPasswordModal from '../components/ForgetPassword/ForgetPassword';
import GoogleSignInButton from '../components/googleAuth/GoogleSignInButton';
// import SmsForm from '../components/SendVerificationSms/SmsForm';
// import ForgetUsernameModal from '../components/ForgetPassword/FrogetUsernameModal';
import TwoFactorAuthentication from '../components/2FA/TwoFactorAuthentication';

function AuthGuard({ children }) {
  const { state } = useAuthContext();
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);

  const toggleForgetPasswordModal = () => {
    setShowForgetPasswordModal(!showForgetPasswordModal);
  };


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
          <div className='google-auth'>
          <GoogleSignInButton/>
          </div>
          <Link to={SIGN_UP_PAGE}>
            <button className="sign-up-button">New User? Sign Up</button>
          </Link>
          <div>
            <button
              className="forget-password-button"
              onClick={() => setShowForgetPasswordModal(true)}
            >
              Forget Password?
            </button>
            {showForgetPasswordModal && (
              <>
                <ForgetPasswordModal 
                  onClose={() => setShowForgetPasswordModal(false)}
                />
              </>
            )}
            {/* <ForgetUsernameModal/> */}
            {/* <TwoFactorAuthentication/> */}
          </div>
        </div>
      )}
    </>
  );
}

export default AuthGuard;
