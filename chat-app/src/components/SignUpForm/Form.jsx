import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { signUp } from '../../api/auth';
import { SIGN_IN_PAGE, HOME_PAGE } from '../../constants/routes';
import { passwordRegex } from '../../utils/Regex';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import styles from '../SignUpForm/SignUpForm.module.scss';

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      lastName: '',
      age: '',
      email: '',
      phoneNumber: '+',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('User name is required'),
      name: Yup.string().required('Name is required'),
      lastName: Yup.string().required('Last name is required'),
      age: Yup.number()
        .required('Age is required')
        .positive('Age must be a positive number')
        .integer('Age must be an integer'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phoneNumber: Yup.string()
        .matches(/^\+[1-9]\d{1,14}$/, 'Invalid phone number')
        .required('Phone number is required'),
      password: Yup.string()
        .matches(passwordRegex, 'Invalid password format')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await handleAsyncOperation(
        async () => {
          await signUp(values);
          navigate(SIGN_IN_PAGE, { state: { success: true } });
        },
        setLoading,
        (error) => setMessage(error.message),
        () => setSubmitting(false)
      );
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      {[
        { label: 'User Name', name: 'username' },
        { label: 'Name', name: 'name' },
        { label: 'Last Name', name: 'lastName' },
        { label: 'Age', name: 'age' },
        { label: 'Email', name: 'email' },
        { label: 'Phone Number', name: 'phoneNumber' },
        { label: 'Password', name: 'password', type: 'password' },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
      ].map(({ label, name, type }) => (
        <div key={name} className={styles.inputContainer}>
          <label htmlFor={name}>{label}</label>
          <input
            type={type === 'password' && !showPassword ? 'password' : 'text'}
            id={name}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.inputField}
          />
          {(name === 'password' || name === 'confirmPassword') && (
            <i
              className={`fa-solid ${
                showPassword ? 'fa-eye' : 'fa-eye-slash'
              } ${styles.togglePassword}`}
              onClick={togglePasswordVisibility}
            />
          )}
          {formik.touched[name] && formik.errors[name] && (
            <p className={styles.error}>{formik.errors[name]}</p>
          )}
        </div>
      ))}
      {message && <p className={styles.message}>{message}</p>}
      {loading && <BarLoader color="#fe3c72" />}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={formik.isSubmitting}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <Link to={HOME_PAGE}>
        <button type="button" className={styles.backButton}>
          Back to Home
        </button>
      </Link>
    </form>
  );
};

export default Form;
