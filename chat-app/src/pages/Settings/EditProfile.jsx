import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const EditProfile = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className="edit-profile-container">
      <div>
        <h3>Edit Profile</h3>
      </div>
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
      <button className="submit-button-userprofile">Submit</button>
    </div>
  );
};

export default EditProfile;
