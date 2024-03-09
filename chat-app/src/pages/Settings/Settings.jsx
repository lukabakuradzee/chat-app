import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../Home/SettingsMenu';
import { HOME_PAGE, VIDEOS } from '../../constants/routes';
import Search from '../Home/Search';
import EditProfile from './EditProfile';

const Settings = () => {
  const [editProfile, setEditProfile] = useState(false);

  const showEditProfile = () => {
    setEditProfile(true);
  };

  return (
    <div className="home-page">
      <aside className="user-profile aside-settings">
        <Link to={HOME_PAGE}>
          <i className="fa-brands fa-microblog app-logo"></i>
        </Link>
        <div className="icons-container-asidebar">
          <i
            class="fa-brands fa-facebook-messenger inbox-messages-icon"
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
      <div className="inboxes">
        <div className="user-account-info">
          <h2 className="settings-heading-text">Settings</h2>
        </div>
        <h2 className="account-center-heading">Accounts Center</h2>
        <div className="accounts-center">
          <div className="account-center-buttons-box" onClick={showEditProfile}>
            <i class="fa-regular fa-circle-user"></i>
            <button className="edit-profile-button">Edit Profile</button>
          </div>
          <div className="account-center-buttons-box" onClick={showEditProfile}>
          <i class="fa-regular fa-bell"></i>
            <button className="edit-profile-button">Notifications</button>
          </div>
          <div className="account-center-buttons-box" onClick={showEditProfile}>
          <i class="fa-solid fa-lock"></i>
            <button className="edit-profile-button">Account Privacy</button>
          </div>
          <div className="account-center-buttons-box" onClick={showEditProfile}>
          <i class="fa-solid fa-ban"></i>
            <button className="edit-profile-button">Blocked</button>
          </div>
          <div className="account-center-buttons-box" onClick={showEditProfile}>
          <i class="fa-solid fa-crown"></i>
            <button className="edit-profile-button">Subscriptions</button>
          </div>
          <div className="account-center-buttons-box" onClick={showEditProfile}>
          <i class="fa-regular fa-comment"></i>
            <button className="edit-profile-button">Comments</button>
          </div>
        </div>
      </div>
      {editProfile && <EditProfile />}
    </div>
  );
};

export default Settings;
