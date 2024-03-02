import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SettingsMenu from './SettingsMenu';

function Home() {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className="home-page">
      <aside className="user-profile">
        <i class="fa-brands fa-microblog app-logo"></i>
        <div className="icons-container-asidebar">
          <i class="fa-brands fa-facebook-messenger inbox-messages-icon"></i>
          <i class="fa-solid fa-house home-page-icon"></i>
          <i class="fa-solid fa-magnifying-glass search-messages-icon"></i>
          <i class="fa-solid fa-film reels-icon"></i>
          <SettingsMenu />
        </div>
      </aside>
      <div className="inboxes">
        <div className="user-account-info">
          <p className="user-username">{user.userName}</p>
          <i class="fa-solid fa-pen-to-square user-info-edit-icon"></i>
        </div>
        <h2 className="inbox-message-heading">Messages</h2>
      </div>
      <div className="chat-space"></div>
    </div>
  );
}

export default Home;
