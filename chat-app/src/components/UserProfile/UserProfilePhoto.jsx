import { useAuthContext } from '../../context/auth/AuthContextProvider';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { useState } from 'react';

const ProfilePhoto = ({ imageUrl }) => {
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
          type="button"
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

export default ProfilePhoto;