import React, { useState } from 'react';
import { signUp } from '../../api/auth';
import { HOME_PAGE, SIGN_IN_PAGE } from '../../constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Form = () => {
  const [info, setInfo] = useState({
    username: '',
    name: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signUpHandler = (e) => {
    e.preventDefault();
    if (
      !info.username ||
      !info.name ||
      !info.lastName ||
      !info.age ||
      !info.email ||
      !info.password
    ) {
      setError('You must fill in all fields');
      return;
    }

    setLoading(true);

    signUp(info)
      .then(() => {
        navigate(SIGN_IN_PAGE, { state: { success: true } });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="sign-in" action="">
      {/* Username */}
      <label htmlFor="username">User Name</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type="text"
          name="username"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-user user-icon"></i>
      </div>

          {/* Name */}
      <label htmlFor="name">Name</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type="text"
          name="name"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-user user-icon"></i>
      </div>
          
          {/* Last Name */}
      <label htmlFor="lastName">Last Name</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type="text"
          name="lastName"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-user user-icon"></i>
      </div>

          {/* Age */}
      <label htmlFor="age">Age</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type="text"
          name="age"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
          />
        <i className="fa-solid fa-user user-icon"></i>
      </div>

            {/* Email */}
      <label htmlFor="email">Email</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type="text"
          name="email"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-envelope user-email"></i>
      </div>

      {/* Password */}
      <label htmlFor="password">Password</label>
      <div className="input-container">
        <input
          className="input-field"
          type="password"
          name="password"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-lock password-icon"></i>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}

      <button className="submit-button" onClick={signUpHandler}>
        Submit
      </button>

      <Link to={HOME_PAGE}>
        <button className="back-home-button">Back to home</button>
      </Link>
    </form>
  );
};

export default Form;
