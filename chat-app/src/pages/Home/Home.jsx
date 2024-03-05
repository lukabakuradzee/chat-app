import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SettingsMenu from './SettingsMenu';
import Messages from '../../components/Messages/Messages';
import { Link } from 'react-router-dom';
import CreateMessage from './CreateMessage';
import Search from './Search';
import { VIDEOS } from '../../constants/routes';
// import EmojiPicker from 'emoji-picker-react';
import Chat from './Chat';

const Home = () => {
  const { state } = useAuthContext();
  const { user } = state;


  return (
    <div className="home-page">
      <aside className="user-profile">
        <i className="fa-brands fa-microblog app-logo"></i>
        <div className="icons-container-asidebar">
          <i class="fa-brands fa-facebook-messenger inbox-messages-icon" title="inbox"></i>
          <Search />
          <i className="fa-solid fa-house home-page-icon" title='home'></i>
          <Link to={VIDEOS}>
            <i className="fa-solid fa-film reels-icon" title='videos'></i>
          </Link>
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
        <h2 className="inbox-message-heading" title='Messages'>Messages</h2>
        <div className="inbox-messages">
          <Messages />
        </div>
      </div>
        <Chat/>
    </div>
  );
};

export default Home;
