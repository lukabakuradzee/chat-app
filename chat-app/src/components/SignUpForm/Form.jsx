import React, { useState } from 'react';
import { signUp } from '../../api/auth';
import { HOME_PAGE, SIGN_IN_PAGE } from '../../constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { passwordRegex } from '../../utils/Regex';
import { useFormik } from 'formik';
import * as Yup from 'yup'
// import { handleAsyncOperation } from '../../utils/handleAsyncOperation';

const Form = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      lastName: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('User name is required'),
      name: Yup.string().required('Name is required'),
      lastName: Yup.string().required('Last name is required'),
      age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .matches(passwordRegex, 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setLoading(true);
      try {
        await signUp(values);
        navigate(SIGN_IN_PAGE, { state: { success: true } });
      } catch (error) {
        console.error(error);
        setFieldError('general', 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // const handleChange = (e) => {
  //   setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setMessage('');

  //   if (!Object.values(info).every(Boolean)) {
  //     setError('You must fill in all fields');
  //     return;
  //   }

  //   if (!passwordRegex.test(info.password)) {
  //     setError(
  //       'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
  //     );
  //     return;
  //   }

  //   if (info.password !== info.confirmPassword) {
  //     setMessage("Passwords don't match");
  //     return;
    

  //   setLoading(true);

  //   signUp(info)
  //     .then(() => navigate(SIGN_IN_PAGE, { state: { success: true } }))
  //     .catch((err) => console.error(err))
  //     .finally(() => setLoading(false));
  // };

  const inputFields = [
    { label: 'User Name', name: 'username' },
    { label: 'Name', name: 'name' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Age', name: 'age' },
    { label: 'Email', name: 'email' },
    { label: 'Password', name: 'password', type: 'password' },
    { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
  ];


    return (
      <form className="sign-up-page" onSubmit={formik.handleSubmit}>
        {inputFields.map(({ label, name, type }) => (
          <div key={name} className="input-container">
            <label htmlFor={name}>{label}</label>
            <input
              className="input-field"
              autoComplete="true"
              type={type === 'password' && !showPassword ? 'password' : 'text'}
              name={name}
              id={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched[name] && formik.errors[name] ? (
              <div className="error">{formik.errors[name]}</div>
            ) : null}
            {(name === 'password' || name === 'confirmPassword') && (
              <>
                {showPassword ? (
                  <i
                    className="fa-solid fa-eye"
                    onClick={togglePasswordVisibility}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </>
            )}
            <i
              className={`fa-solid fa-${name === 'email' ? 'envelope' : name === 'password' ? 'lock' : name === 'confirmPassword' ? 'lock' : 'user'} ${name}-icon`}
            />
          </div>
          
        ))}
        
        {loading && (
          <div className="bar-loader">
            <BarLoader color="#fe3c72" />
          </div>
        )}
        {formik.errors.general && <p style={{ color: 'red', textAlign: 'center' }}>{formik.errors.general}</p>}
        <button className="submit-button" type="submit" disabled={formik.isSubmitting}>
          Submit
        </button>
        <Link to={HOME_PAGE}>
          <button className="back-home-button">Back to home</button>
        </Link>
      </form>

    );
        }
  

export default Form;