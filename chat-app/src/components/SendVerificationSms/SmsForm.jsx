import React, { useState } from 'react';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import {
  // sendVerificationSms,
  verifySmsCode,
} from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

function SmsForm({ phoneNumber }) {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  // const [codeSent, setCodeSent] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState('');

  // const formikSendSms = useFormik({
  //   initialValues: {
  //     to: '',
  //   },
  //   validationSchema: Yup.object({
  //     to: Yup.string().required('Phone number is required'),
  //   }),
  //   onSubmit: async (values) => {
  //     setLoading(true);
  //     setPhoneNumber(values.to);
  //     await handleAsyncOperation(
  //       async () => {
  //        const data = await sendVerificationSms(
  //           formikSendSms.values.to,
  //           values.code,
  //         );
  //         setMessage(`SMS code was sent to: ${values.to}`);
  //         console.log("Phone Number: ", values.to)
  //         setCodeSent(true);
  //       },
  //       setLoading,
  //       (error) => setMessage(error.message),
  //     );
  //   },
  // });

  const formikVerifyCode = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Verification Code is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await handleAsyncOperation(
        async () => {
          const response = await verifySmsCode(phoneNumber, values.code);
          console.log('Response: ', response);
          setMessage('sms code verified successfully');
        },
        setLoading,
        (error) => setMessage(error.message),
      );
    },
  });

  return (
    <div>
      <h1>Sign in via OTP</h1>
      {/* {!codeSent ? (
        <form onSubmit={formikSendSms.handleSubmit}>
          <div style={{ marginBottom: '1em' }}>
            <label>Phone Number:</label>
            <input
              style={{ marginBottom: '0.5em' }}
              id="to"
              name="to"
              type="text"
              value={formikSendSms.values.to}
              onChange={formikSendSms.handleChange}
              onBlur={formikSendSms.handleBlur}
              required
            />
            {formikSendSms.touched.to && formikSendSms.errors.to ? (
              <div>{formikSendSms.errors.to}</div>
            ) : null}
          </div>
          <button type="submit">Send SMS</button>
        </form>
      ) : ( */}
      <form onSubmit={formikVerifyCode.handleSubmit}>
        <div>
          <label>Verification Code:</label>
          <input
            id="code"
            name="code"
            type="text"
            value={formikVerifyCode.values.code}
            onChange={formikVerifyCode.handleChange}
            onBlur={formikVerifyCode.handleBlur}
            required
          />
          {formikVerifyCode.touched.code && formikVerifyCode.errors.code ? (
            <div>{formikVerifyCode.errors.code}</div>
          ) : null}
        </div>
        <button type="submit" style={{marginTop:"1em"}}>Verify Code</button>
      </form>

      {message && <div>{message}</div>}
      {error && <div>Error: {error}</div>}
      {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
    </div>
  );
}

export default SmsForm;
