import React from 'react';
import { logOutAction } from '../../context/auth/actions';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ dispatch }) => {
const navigate = useNavigate();

  return (
    <button
      className="button-log-out"
      onClick={() => {
        dispatch(logOutAction());
        navigate('/')
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
