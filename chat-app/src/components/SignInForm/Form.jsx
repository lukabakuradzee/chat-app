import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SignIn from '../../pages/SignIn/SignIn';
import { logInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Form = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    userName: '',
    password: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setInfo((prev) => ({
      ...prev,
      error: '',
    }));

    SignIn(info)
      .then((data) => {
        dispatch(logInAction(data));
        navigate(HOME_PAGE);
      })
      .catch((err) => {
        setInfo((prev) => ({ ...prev, err: err.message }));
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <form className="sign-in">
    <label htmlFor="username">
       User Name
    </label>
    <div className="input-container">
      <input
        className="input-field"
        autoComplete="true"
        value={info.userName}
        type="text"
        name="userName"
        onChange={(e) => {
          setInfo((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
          });
        }}
      />
      <i className="fa-solid fa-user user-icon"></i>
    </div>

    <label htmlFor="password">
      Password
    </label>
    <div className="input-container">
      <input
        className="input-field"
        autoComplete="true"
        type="password"
        value={info.password}
        name="password"
        onChange={(e) => {
          setInfo((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
          });
        }}
      />
      <i className="fa-solid fa-lock password-icon"></i>
    </div>
    {loading && (
        <button type="submit" disabled></button>
    )}
    {info.error && <h4>{info.error}</h4>}
    <button onClick={submitHandler}>
   Submit
    </button>
    <Link className="back-home" to={HOME_PAGE}>
      <button>
        back to home
      </button>
    </Link>
  </form>
  )
};


export default Form;