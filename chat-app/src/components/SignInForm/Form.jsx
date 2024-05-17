import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { BarLoader } from 'react-spinners';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';

const Form = () => {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  // const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("User name is required"),
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
      <label htmlFor="username">User Name</label>
      <div className="input-container">
        <input
          className="input-field"
          id='username'
          type="text"
          autoComplete="true"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <i className="fa-solid fa-user user-icon"></i>
      </div>
      {formik.touched.username && formik.errors.username ? (
        <div className="error">{formik.errors.username}</div>
      ) : null}

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
        <div className="error">{formik.errors.password}</div>
      ) : null}

       <div>
       {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
       </div>
      {message && <h4>{message}</h4>}
      {/* {message && <h5>{message}</h5>} */}
      <button className="login-button" type='submit'>
        Login
      </button>
      <Link className="back-home" to={HOME_PAGE}>
        <button className="back-home-button">Back to home</button>
      </Link>
    </form>
  );
};

export default Form;
