import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction } from '../../context/auth/actions';

function Home() {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  return (
    <div className="home-page">
      {user && (
        <button
          className="button-log-out"
          onClick={() => {
            dispatch(logOutAction());
          }}
        >
          LOGOUT
        </button>
      )}
    </div>
  );
}

export default Home;
