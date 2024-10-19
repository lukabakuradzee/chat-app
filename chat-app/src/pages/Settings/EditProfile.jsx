import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import Bio from '../../components/UserProfile/UserBio';
import Gender from '../../components/UserProfile/UserGender';
import ProfilePhoto from '../../components/UserProfile/UserProfilePhoto.jsx';
import { updateUserBio } from '../../api/auth';

const EditProfile = ({ userId }) => {
const { state } = useAuthContext();
const { user } = state;
const [bio, setBio] = useState(user.bio);
const [gender, setGender] = useState(user.gender);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await updateUserBio(userId, bio, gender);
    setBio(response.bio);
    setGender(response.gender);
    localStorage.setItem('accessToken', response.token)
    setMessage('User bio updated');
    setTimeout(() => {
      setMessage('')
    }, 2000);
  } catch (error) {
    console.error(error);
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  setBio(user.bio)
  setGender(user.gender)
}, [user])

// if (loading) return <div>loading...</div>;

return (
  <div className="edit-profile-container">
    <form onSubmit={handleSubmit}>
      <div>
        <h3>Edit Profile</h3>
      </div>
      <div className="user-account-component-wrapper">
        <ProfilePhoto photo={user.userAvatar} username={user.username} />
        <Bio bio={bio} setBio={setBio} />
        <Gender gender={gender} setGender={setGender} />
        <button
          className="submit-button-userprofile"
          type="submit"
          // disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
    </form>
    <div>{message}</div>
  </div>
);
};

export default EditProfile;
