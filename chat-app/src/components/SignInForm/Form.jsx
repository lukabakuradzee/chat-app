import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { BarLoader } from 'react-spinners';

const Form = () => {
  const { dispatch } = useAuthContext();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    username: '',
    password: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setInfo((prev) => ({
      ...prev,
      error: '',
    }));

    signIn(info)
      .then((data) => {
        dispatch(logInAction(data));
        navigate(HOME_PAGE);
      })
      .catch((error) => {
        setInfo((prev) => ({ ...prev, err: error.message }));
        setMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="sign-in">
      <label htmlFor="username">User Name</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          value={info.username}
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

      <label htmlFor="password">Password</label>
      <div className="input-container">
        <input
          className="input-field"
          autoComplete="true"
          type={showPassword ? "password" : "text"}
          value={info.password}
          name="password"
          onChange={(e) => {
            setInfo((prev) => {
              return { ...prev, [e.target.name]: e.target.value };
            });
          }}
        />
        <i className="fa-solid fa-lock password-icon"></i>
        {showPassword ? (
          <i
            class="fa-solid fa-eye-slash"
            onClick={togglePasswordVisibility}
          ></i>
        ) : (
          <i class="fa-solid fa-eye" onClick={togglePasswordVisibility}></i>
        )}
      </div>
      {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
      {message && <h4>{message}</h4>}
      {/* {message && <h5>{message}</h5>} */}
      <button className="login-button" onClick={submitHandler}>
        Login
      </button>
      <Link className="back-home" to={HOME_PAGE}>
        <button className="back-home-button">Back to home</button>
      </Link>
    </form>
  );
};

export default Form;
