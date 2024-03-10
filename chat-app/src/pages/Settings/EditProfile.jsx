import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

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
const Bio = ({ bio, setBio }) => {
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  return (
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
        value={bio}
        onChange={handleBioChange}
      ></textarea>
    </div>
  );
};

// Gender component
const Gender = ({ gender, setGender }) => {
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="user-gender-container">
      <div>
        <h4>Gender</h4>
      </div>
      <select
        name="gender"
        id="select-gender"
        value={gender}
        onChange={handleGenderChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="prefer-not-tosay">Prefer not to say</option>
      </select>
    </div>
  );
};

// Main EditProfile component
const EditProfile = ({ userName }) => {
  const { state } = useAuthContext();
  const { user } = state;
  const [bio, setBio] = useState(user.bio || '');
  const [gender, setGender] = useState(user.gender || '');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    // Check if there are any changes
    const hasChanges = bio !== user.bio || gender !== user.gender;
    setIsSubmitDisabled(!hasChanges);
  }, [bio, gender, user.bio, user.gender]);

  const handleSubmit = (e) => {
    e.preventDefault()
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
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
          <Bio bio={bio} setBio={setBio} />
          <Gender gender={gender} setGender={setGender} />
          <button
            className="submit-button-userprofile"
            type="submit"
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
