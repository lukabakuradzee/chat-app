import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { BarLoader } from 'react-spinners';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import SmsForm from '../SendVerificationSms/SmsForm';
import styles from '../SignInForm/SignInForm.module.scss';

const Form = () => {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
      showPassword: false,
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      await handleAsyncOperation(
        async () => {
          const data = await signIn(values);
          dispatch(logInAction(data));
          navigate(HOME_PAGE);
        },
        setLoading,
        (error) => setMessage(error.message),
      );
    },
  });

  return (
    <>
      <form className={styles.signIn} onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Username or Email</label>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            id="identifier"
            type="text"
            autoComplete="true"
            name="identifier"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <i className={`fa-solid fa-user ${styles.icon}`}></i>
        </div>

        <label htmlFor="password">Password</label>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            autoComplete="true"
            id="password"
            type={formik.values.showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <i className={`fa-solid fa-lock password-icon ${styles.icon}`}></i>
          <i
            className={`fa-solid fa-eye${formik.values.showPassword ? '' : '-slash'} ${styles.eyeIcon}`}
            onClick={() =>
              formik.setFieldValue('showPassword', !formik.values.showPassword)
            }
          ></i>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <p className={styles.error}>{formik.errors.password}</p>
        ) : null}
        {formik.touched.identifier && formik.errors.identifier ? (
          <p className={styles.error}>{formik.errors.identifier}</p>
        ) : null}
        <div>
          {loading && (
            <div className="bar-loader" style={{}}>
              <BarLoader color="#fe3c72" />
            </div>
          )}
        </div>
        {message && <h4 className={styles.message}>{message}</h4>}
        <button className={styles.submitButton} type="submit">
          Login
        </button>
      </form>
      <SmsForm />
      {/* <CaptchaGoogle/> */}
    </>
  );
};

export default Form;
