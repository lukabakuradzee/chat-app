// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { verifyEmail } from '../../api/auth';

// function VerifyEmail() {
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const { token } = useParams(); // Assuming you're using React Router's useParams hook to get the token from the URL

//   useEffect(() => {
//     const handleVerify = async () => {
//       try {
//         const response = await verifyEmail(token); // Pass the token to the verifyEmail function
//         setVerificationStatus(response.message);
//       } catch (error) {
//         console.error('Error verifying email:', error);
//         setVerificationStatus('Failed to verify email');
//       }
//     };

//     handleVerify();
//   }, [token]);

//   return (
//     <div>
//       {verificationStatus === '' ? (
//         <div>Verifying...</div>
//       ) : (
//         <div>{verificationStatus}</div>
//       )}
//     </div>
//   );
// }

// export default VerifyEmail;

import React from 'react'

function VerifyEmail() {
  return (
    <div>VerifyEmail</div>
  )
}

export default VerifyEmail
