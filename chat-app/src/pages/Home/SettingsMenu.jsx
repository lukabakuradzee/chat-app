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
        class="fa-solid fa-bars settings-modal-menu"
        onClick={toggleSettingsMenu}
      ></i>
      {showSettingsMenu && (
        <div className="settings-modal">
          <p>
            <i class="fa-solid fa-gear"></i>Settings
          </p>
          <p>
            <i class="fa-solid fa-chart-line activity-icon"></i>Your Activity
          </p>
          <p>
            <i class="fa-regular fa-bookmark save-icon"></i>Saved
          </p>
          <p>
            <i class="fa-regular fa-moon"></i>
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
