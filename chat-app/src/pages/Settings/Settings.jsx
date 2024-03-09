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

  const ButtonWithIcon = ({ iconClass, buttonText, onClick }) => {
    return (
      <div className="account-center-buttons-box" onClick={onClick}>
        <i className={iconClass}></i>
        <button className="edit-profile-button">{buttonText}</button>
      </div>
    );
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
          <ButtonWithIcon
            iconClass="fa-regular fa-circle-user"
            buttonText="Edit Profile"
            onClick={showEditProfile}
          />
          <ButtonWithIcon
            iconClass="fa-regular fa-bell"
            buttonText="Notifications"
            onClick={showEditProfile}
          />
          <ButtonWithIcon
            iconClass="fa-solid fa-lock"
            buttonText="Account Privacy"
            onClick={showEditProfile}
          />
          <ButtonWithIcon
            iconClass="fa-solid fa-ban"
            buttonText="Blocked"
            onClick={showEditProfile}
          />
          <ButtonWithIcon
            iconClass="fa-solid fa-crown"
            buttonText="Subscriptions"
            onClick={showEditProfile}
          />
          <ButtonWithIcon
            iconClass="fa-regular fa-comment"
            buttonText="Comments"
            onClick={showEditProfile}
          />
        </div>
      </div>
      {editProfile && <EditProfile />}
    </div>
  );
};

export default Settings;
