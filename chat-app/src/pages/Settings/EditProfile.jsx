import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import Bio from '../../components/UserProfile/UserBio';
import Gender from '../../components/UserProfile/UserGender';
import ProfilePhoto from '../../components/UserProfile/UserProfilePhoto.jsx';


const EditProfile = ({ userName }) => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [bio, setBio] = useState(
    localStorage.getItem(`user_${user.userID}_bio`) || user.bio || '',
  );

  const [gender, setGender] = useState(
    localStorage.getItem(`user_${user.userID}_gender`) || user.gender || '',
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
    localStorage.setItem(`user_${user.userID}_bio`, bio);
  }, [bio, user.userID]);

  useEffect(() => {
    localStorage.setItem(`user_${user.userID}_gender`, gender);
  }, [gender, user.userID]);

  console.log('State : ', state);


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
