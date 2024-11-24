import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import SettingsMenu from './SettingsMenu';
import CreateMessage from './CreateMessage';
import Search from './Search';
import { Link } from 'react-router-dom';
import { NOTIFICATION, PEOPLE } from '../../constants/routes';
import Messages from '../../components/Messages/Messages';
import Chat from './Chat';
import styles from './Home.module.scss';

const Home = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className={styles.homePage}>
      <aside className={styles.sidebar}>
        <Link to={PEOPLE}>
          <i className={`fa-brands fa-microblog ${styles.appLogo}`}></i>
        </Link>
        <div className={styles.iconContainer}>
          <i className={`fa-brands fa-facebook-messenger ${styles.icon}`} title="Inbox"></i>
          <Search />
          <Link to="/feed">
            <i className={`fa-solid fa-house ${styles.icon}`} title="Home"></i>
          </Link>
          <Link to={NOTIFICATION}>
            <i className={`fa-regular fa-heart ${styles.icon}`} title="Notifications"></i>
          </Link>
          <SettingsMenu />
        </div>
      </aside>

      <section className={styles.inboxes}>
        <div className={styles.userAccountInfo}>
          <Link to={`/${user.username}`}>
            <p className={styles.userUsername}>{user.username}</p>
          </Link>
          <CreateMessage />
        </div>
        <h2 className={styles.messagesHeading} title="Messages">
          Messages
        </h2>
        <div className={styles.messageList}>
          <Messages />
        </div>
      </section>

      <section className={styles.chatSpace}>
        <Chat />
      </section>
    </div>
  );
};

export default Home;
