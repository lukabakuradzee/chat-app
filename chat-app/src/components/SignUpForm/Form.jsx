import React, { useState } from 'react';
import { signUp } from '../../api/auth';
import { HOME_PAGE, SIGN_IN_PAGE } from '../../constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { passwordRegex } from '../../utils/Regex';

const Form = () => {
  const [info, setInfo] = useState({
    username: '',
    name: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!Object.values(info).every(Boolean)) {
      setError('You must fill in all fields');
      return;
    }

    if (!passwordRegex.test(info.password)) {
      setError(
        'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
      return;
    }

    if (info.password !== info.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setLoading(true);

    signUp(info)
      .then(() => navigate(SIGN_IN_PAGE, { state: { success: true } }))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

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
    <form className="sign-up-page" onSubmit={handleSubmit}>
      {inputFields.map(({ label, name, type }) => (
        <div key={name} className="input-container">
          <label htmlFor={name}>{label}</label>
          <input
            className="input-field"
            autoComplete="true"
            type={type === 'password' && !showPassword ? 'password' : 'text'}
            name={name}
            value={info[name]}
            onChange={handleChange}
          />
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
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading && (
        <div className="bar-loader">
          <BarLoader color="#fe3c72" />
        </div>
      )}
      {message && <p>{message}</p>}
      <button className="submit-button" type="submit">
        Submit
      </button>
      <Link to={HOME_PAGE}>
        <button className="back-home-button">Back to home</button>
      </Link>
    </form>
  );
};

export default Form;