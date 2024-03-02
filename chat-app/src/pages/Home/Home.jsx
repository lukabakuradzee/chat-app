import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SettingsMenu from './SettingsMenu';
import Messages from '../../components/Messages/Messages';
import { Link } from 'react-router-dom';
import CreateMessage from './CreateMessage';

const Home = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className="home-page">
      <aside className="user-profile">
        <i className="fa-brands fa-microblog app-logo"></i>
        <div className="icons-container-asidebar">
          <i class="fa-brands fa-facebook-messenger inbox-messages-icon"></i>
          <i className="fa-solid fa-house home-page-icon"></i>
          <i className="fa-solid fa-magnifying-glass search-messages-icon"></i>
          <i className="fa-solid fa-film reels-icon"></i>
          <SettingsMenu/>
        </div>
      </aside>
      <div className="inboxes">
        <div className="user-account-info">
          <Link to={`/user/${user.userName}`}>
            <p className="user-username">{user.userName}</p>
          </Link>
          <CreateMessage />
        </div>
        <h2 className="inbox-message-heading">Messages</h2>
        <div className="inbox-messages">
          <Messages />
        </div>
      </div>
      <div className="chat-space"></div>
    </div>
  );
};

export default Home;
