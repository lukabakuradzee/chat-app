import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction } from '../../context/auth/actions';
import { Link } from 'react-router-dom';
import { SETTINGS } from '../../constants/routes';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

function SettingsMenu() {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const toggleSettingsMenu = () => {
    setShowSettingsMenu((prevState) => !prevState);
  };

  useEscapeKeyHandler(() => {
    setShowSettingsMenu(false);
  })

  
  return (
    <>
      <i
        className="fa-solid fa-bars settings-modal-menu"
        onClick={toggleSettingsMenu}
        title="menu"
      />
      {showSettingsMenu && (
        <div className="settings-modal">
          <Link to={SETTINGS}><MenuItem icon="fa-solid fa-gear" text="Settings" /></Link>
          <MenuItem icon="fa-solid fa-chart-line activity-icon" text="Your Activity" />
          <MenuItem icon="fa-regular fa-bookmark save-icon" text="Saved" />
          <MenuItem icon="fa-regular fa-moon" text="Switch Mode" />
          {user && <LogoutButton dispatch={dispatch} />}
        </div>
      )}
    </>
  );
}

// MenuItem component
const MenuItem = ({ icon, text }) => (
  <p>
    <i className={icon} title={text} />{text}
  </p>
);

// LogoutButton component
const LogoutButton = ({ dispatch }) => (
  <button
    className="button-log-out"
    onClick={() => {
      dispatch(logOutAction());
    }}
  >
    Logout
  </button>
);

export default SettingsMenu;
