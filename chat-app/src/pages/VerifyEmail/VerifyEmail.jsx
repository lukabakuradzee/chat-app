import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailStatus } from '../../api/auth';
import { RingLoader } from 'react-spinners';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import {  verifyEmailAction } from '../../context/auth/actions';

const VerifyEmail = () => {
  const { token } = useParams();
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      await handleAsyncOperation(
        async () => {
          const result = await verifyEmailStatus(token);
          dispatch(verifyEmailAction(result.status))
          setVerificationStatus('Email Verified Successfully');
          setLoading(false);
          setTimeout(() => {
            navigate(`/accounts/${user.username}/edit`);
          }, 2000);
        },
        setLoading,
        (error) => setError(error.message),
      );
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-modal">
      {error && <h1>{error}</h1>}
      {loading && (
        <div className="bar-loader" style={{}}>
          <RingLoader color="#fe3c72" />
        </div>
      )}
      <h3>{verificationStatus}</h3>
    </div>
  );
};

export default VerifyEmail;
