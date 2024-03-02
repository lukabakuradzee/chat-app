import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { logOutAction } from '../../context/auth/actions';
import { useState, useEffect } from 'react';

function Home() {
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
    <div className="home-page">
      <aside className="user-profile">
        <i class="fa-brands fa-microblog app-logo"></i>
        <div className="icons-container-asidebar">
          <i class="fa-brands fa-facebook-messenger inbox-messages-icon"></i>
          <i class="fa-solid fa-house home-page-icon"></i>
          <i class="fa-solid fa-magnifying-glass search-messages-icon"></i>
          <i class="fa-solid fa-film reels-icon"></i>
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
                <i class="fa-solid fa-chart-line activity-icon"></i>Your
                Activity
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
        </div>
      </aside>
      <div className="inboxes">
        <div className="user-account-info">
          <p className='user-username'>{user.userName}</p>
          <i class="fa-solid fa-pen-to-square user-info-edit-icon"></i>
        </div>
        <h2 className='inbox-message-heading'>Messages</h2>
      </div>
      <div className="chat-space"></div>
    </div>
  );
}

export default Home;
