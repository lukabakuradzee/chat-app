import React from 'react';

const UserComment = ({ imageUrl, profilePicutre, username }) => {
  
  return (
    <div className="user-post-full-width-container">
      <div className="user-post-photo-fullwidth">
        <img src={imageUrl} alt="" />
      </div>
      <section className="user-comment-section">
        <div className="comment-section-header">
          <img src={profilePicutre} alt="" />
          <span>{username}</span>
        </div>
        <div className="comment-list">
          {/* Display existing comments here */}
          {/* Example: */}
          {/* <div className="comment-item">
            <img src={profilePicture} alt="" />
            <span>{username}: Comment text</span>
          </div> */}
        </div>
        <div className="comment-input">
          {/* <img src={profilePicutre} alt="" /> */}
          <input type="text" placeholder="Add a comment..." />
          <button>Post</button>
        </div>
      </section>
    </div>
  );
};

export default UserComment;
