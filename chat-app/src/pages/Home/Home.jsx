import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SettingsMenu from './SettingsMenu';
import CreateMessage from './CreateMessage';
import Search from './Search';
import { Link } from 'react-router-dom';
import { VIDEOS } from '../../constants/routes';
import Messages from '../../components/Messages/Messages';
import Chat from './Chat';

const Home = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className="home-page">
      {/* User Profile Sidebar */}
      <aside className="user-profile">
        <i className="fa-brands fa-microblog app-logo"></i>
        <div className="icons-container-asidebar">
          <i
            className="fa-brands fa-facebook-messenger inbox-messages-icon"
            title="inbox"
          ></i>
          <Search />
          <Link to={'/feed'}>
            <i className="fa-solid fa-house home-page-icon" title="home"></i>
          </Link>
          <Link to={VIDEOS}>
            <i className="fa-solid fa-film reels-icon" title="videos"></i>
          </Link>
          <SettingsMenu />
        </div>
      </aside>

      {/* Main Content */}
      <div className="inboxes">
        <div className="user-account-info">
          <Link to={`/${user.username}`}>
            <p className="user-username">{user.username}</p>
          </Link>
          <CreateMessage />
        </div>
        <h2 className="inbox-message-heading" title="Messages">
          Messages
        </h2>
        <div className="inbox-messages">
          <Messages />
        </div>
      </div>
      {/* {showEditProfile && <EditProfile />} */}

      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default Home;
