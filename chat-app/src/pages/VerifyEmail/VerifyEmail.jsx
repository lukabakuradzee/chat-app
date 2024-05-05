import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyEmailStatus } from '../../api/auth';

const VerifyEmail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    verifyEmailStatus(token)
      .then((success) => {
        if (success) {
          setVerificationStatus('Email Verified Successfully');
        } else {
          setVerificationStatus('Email Verification Failed');
        }
      })
      .catch((error) => {
        console.error('Error verify email status', error);
        setVerificationStatus('Email Verification Failed');
      });
  }, [token]);

  return (
    <div>
      <h2>Email Verification</h2>
      <h3>{verificationStatus}</h3>
    </div>
  );
};

export default VerifyEmail;
