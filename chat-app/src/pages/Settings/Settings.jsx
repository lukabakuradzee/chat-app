import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../Home/SettingsMenu';
import { EDIT_PROFILE, HOME_PAGE, NOTIFICATION } from '../../constants/routes';
import Search from '../Home/Search';
import EditProfile from './EditProfile';

const Settings = () => {
  const [editProfile, setEditProfile] = useState(false);

  const showEditProfile = () => {
    setEditProfile(true);
  };

  const ButtonWithIcon = ({ iconClass, buttonText, onClick, to }) => {
    return (
      <div className="account-center-buttons-box" onClick={onClick}>
        <Link to={to}>
          <i className={iconClass}></i>
          <button className="edit-profile-button">{buttonText}</button>
        </Link>
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
          <Link to={NOTIFICATION}>
            <i
              className="fa-solid fa-film reels-icon"
              title="notifications"
            ></i>
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
            to={EDIT_PROFILE}
          />
          <ButtonWithIcon
            iconClass="fa-regular fa-bell"
            buttonText="Notifications"
          />
          <ButtonWithIcon
            iconClass="fa-solid fa-lock"
            buttonText="Account Privacy"
          />
          <ButtonWithIcon iconClass="fa-solid fa-ban" buttonText="Blocked" />
          <ButtonWithIcon
            iconClass="fa-solid fa-crown"
            buttonText="Subscriptions"
          />
          <ButtonWithIcon
            iconClass="fa-regular fa-comment"
            buttonText="Comments"
          />
        </div>
      </div>
      {editProfile && <EditProfile />}
    </div>
  );
};

export default Settings;
