import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const EditProfile = () => {
  const { state } = useAuthContext();
  const { user } = state;
  return (
    <div className="edit-profile-container">
      <h3>Edit Profile</h3>
      <div className="user-profile-photo">
        <div className="photo-name-box">
          <img
            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww"
            alt=""
          />
          <span className="username-span-settings">@{user.userName}</span>
        </div>
        <div>
          <button className="button-change-photo">Change Photo</button>
        </div>
      </div>
      <div className="user-bio-container">
        <h4>Bio</h4>
        <textarea name="bio" id="user-bio" cols="73" rows="2" placeholder='Bio'></textarea>
      </div>
      <div className="user-gender-container">
        <h4>Gender</h4>
        <select name="gender" id="select-gender">
            <option value="male">male</option>
            <option value="female">female</option>
        </select>
      </div>
    </div>
  );
};

export default EditProfile;
