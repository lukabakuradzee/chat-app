import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import Bio from '../../components/UserProfile/UserBio';
import Gender from '../../components/UserProfile/UserGender';
import ProfilePhoto from '../../components/UserProfile/UserProfilePhoto.jsx';

const EditProfile = ({ userName }) => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [bio, setBio] = useState(
    localStorage.getItem(`user_BIO_${user.userID}`) || user.bio || '',
  );

  const [gender, setGender] = useState(
    localStorage.getItem(`user_GENDER_${user.userID}`) || user.gender || '',
  );
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    // Check if there are any changes
    const hasChanges = bio !== user.bio || gender !== user.gender;
    setIsSubmitDisabled(!hasChanges);
  }, [bio, gender, user.bio, user.gender, user.userID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_USER_INFO', payload: { bio, gender } });
    alert('Bio updated successfully');
  };

  useEffect(() => {
    localStorage.setItem(`user_BIO_${user.userID}`, bio);
  }, [bio, user.userID]);

  useEffect(() => {
    localStorage.setItem(`user_GENDER_${user.userID}`, gender);
  }, [gender, user.userID]);


  return (

    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Edit Profile</h3>
        </div>
        <div className="user-account-component-wrapper">
          <ProfilePhoto
            imageUrl={
              'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?cs=srgb&dl=pexels-stefan-stefancik-91227.jpg&fm=jpg'
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

