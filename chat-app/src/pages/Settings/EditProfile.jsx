import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import useEscapeKeyHandler  from '../../Hooks/EscapeHandler';

// ProfilePhoto component
const ProfilePhoto = ({ imageUrl, userName }) => {
  const { state } = useAuthContext();
  const { user } = state;
  const [showAttachmentBox, setShowAttachmentBox] = useState(false);

  const handleAttachmentBoxToggle = () => {
    setShowAttachmentBox(!showAttachmentBox);
  };

  useEscapeKeyHandler(() => {
    setShowAttachmentBox(false);
  });

  const handlePhotoAttach = (e) => {
    // Handle photo attachment logic here
    // You can use this function to upload the selected photo
  };

  return (
    <div className="user-profile-photo">
      <div className="photo-name-box">
        <img src={imageUrl} alt="" />
        <span className="username-span-settings">@{user.userName}</span>
      </div>
      <div>
        <button
          className="button-change-photo"
          onClick={handleAttachmentBoxToggle}
        >
          Change Photo
        </button>
        {showAttachmentBox && (
          <div
            className="page-overlay"
            onClick={() => handleAttachmentBoxToggle()}
          >
            <div className="attachment-user-photo-box">
              <h3>Change Profile Photo</h3>
              <input type="file" onChange={handlePhotoAttach} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Bio component
const Bio = () => (
  <div className="user-bio-container">
    <div>
      <h4>Bio</h4>
    </div>
    <textarea
      name="bio"
      id="user-bio"
      cols="73"
      rows="2"
      placeholder="Bio"
    ></textarea>
  </div>
);

// Gender component
const Gender = () => (
  <div className="user-gender-container">
    <div>
      <h4>Gender</h4>
    </div>
    <select name="gender" id="select-gender">
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="prefer-not-tosay">Prefer not to say</option>
    </select>
  </div>
);

// Main EditProfile component
const EditProfile = ({ userName }) => {
  return (
    <div className="edit-profile-container">
      <div>
        <h3>Edit Profile</h3>
      </div>
      <div className="user-account-component-wrapper">
        <ProfilePhoto
          imageUrl={
            'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww'
          }
          userName={userName}
        />
        <Bio />
        <Gender />
        <button className="submit-button-userprofile">Submit</button>
      </div>
    </div>
  );
};

export default EditProfile;
