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

const Form = () => {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  
  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
      showPassword: false,
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      await handleAsyncOperation(async () => {
      const data = await signIn(values)
        dispatch(logInAction(data));
        navigate(HOME_PAGE);

      }, setLoading, (error) => setMessage(error.message),
      )
    },
    
  })
  
  return (
    <form className="sign-in" onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Username or Email</label>
      <div className="input-container">
        <input
          className="input-field"
          id='identifier'
          type="text"
          autoComplete="true"
          name="identifier"
          value={formik.values.identifier}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <i className="fa-solid fa-user user-icon"></i>
      </div>

      <label htmlFor="password">Password</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          id='password'
          type={formik.values.showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
       <i className="fa-solid fa-lock password-icon"></i>
        <i
          className={`fa-solid fa-eye${formik.values.showPassword ? '' : '-slash'}`}
          onClick={() => formik.setFieldValue('showPassword', !formik.values.showPassword)}
        ></i>
      </div>
      {formik.touched.password && formik.errors.password ? (
        <p className="error">{formik.errors.password}</p>
      ) : null}
      {formik.touched.identifier && formik.errors.identifier ? (
        <p className="error">{formik.errors.identifier}</p>
      ) : null}
       <div>
       {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
       </div>
      {message && <h4>{message}</h4>}
      <button className="login-button" type='submit'>
        Login
      </button>
      <SmsForm/>
    </form>
  );
};

export default Form;
