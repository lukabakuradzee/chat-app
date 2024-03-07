import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction } from '../../context/auth/actions';

function SettingsMenu() {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const toggleSettingsMenu = () => {
    setShowSettingsMenu((prevState) => !prevState);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowSettingsMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <i
        className="fa-solid fa-bars settings-modal-menu"
        onClick={toggleSettingsMenu}
        title="menu"
      ></i>
      {showSettingsMenu && (
        <div className="settings-modal">
          <p>
            <i className="fa-solid fa-gear" title="settings"></i>Settings
          </p>
          <p>
            <i className="fa-solid fa-chart-line activity-icon"></i>Your
            Activity
          </p>
          <p>
            <i className="fa-regular fa-bookmark save-icon"></i>Saved
          </p>
          <p>
            <i className="fa-regular fa-moon"></i>
            Switch Mode
          </p>
          {user && (
            <button
              className="button-log-out"
              onClick={() => {
                dispatch(logOutAction());
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default SettingsMenu;
