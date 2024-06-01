import React, { useState } from 'react';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import {
  sendVerificationSms,
  verifySmsCode,
} from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SmsForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const [codeSent, setCodeSent] = useState(false);

  const formikSendSms = useFormik({
    initialValues: {
      to: '',
    },
    validationSchema: Yup.object({
      to: Yup.string().required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await handleAsyncOperation(
        async () => {
          const data = await sendVerificationSms(
            formikSendSms.values.to,
            values.code,
          );
          setResponse(data.message);
          setCodeSent(true);
        },
        setLoading,
        (error) => setMessage(error.message),
      );
    },
  });

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
          const data = await verifySmsCode(
            formikVerifyCode.values.to,
            values.code,
          );
          console.log('Response: ', data);
          setResponse(data);
        },
        setLoading,
        (error) => setMessage(error.message),
      );
    },
  });

  return (
    <div>
      <h1>Send SMS</h1>
      {!codeSent ? (
        <form onSubmit={formikSendSms.handleSubmit}>
          <div>
            <label>Phone Number:</label>
            <input
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
      ) : (
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
          <button type="submit">Verify Code</button>
        </form>
      )}

      {message && <div>{JSON.stringify(message)}</div>}
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
