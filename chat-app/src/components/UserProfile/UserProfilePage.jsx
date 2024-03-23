import { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import UserComment from './UserComment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import { sliderSettings } from '../Slider/Slider';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const UserProfilePage = ({
  username,
  profilePicture,
  userPosts,
  followersCount,
  followingCount,
  posts,
}) => {
  const { state } = useAuthContext();
  const { user } = state;
  const [selectedPost, setSelectedPost] = useState(null);

  const handleClickPost = (postId) => {
    setSelectedPost(postId === selectedPost ? null : postId);
  };

  useEscapeKeyHandler(() => setSelectedPost(false));

  return (
    <div className="user-profile-info">
      <div className="profile-header">
        <div className="user-photo-header">
          <img src={profilePicture} alt="Profile" />
          <h1>{username}</h1>
          <div className="btn-container-user-profile">
            <button className="edit-profile-user-btn">
              <Link to={`/accounts/${user.userName}/edit`}>Edit Profile</Link>
            </button>
            <button className="view-archive-profile-user">View archive</button>
          </div>
          <div className="follow-info">
            <span>{userPosts} posts</span>
            <span>{followersCount} followers</span>
            <span>{followingCount} following</span>
          </div>
        </div>
      </div>
      <h2>
        <i className="fa-solid fa-table-cells"></i>Posts
      </h2>
      <div className="user-posts">
        {posts &&
          posts.map((post) => (
            <div
              key={post.id}
              className="post"
              onClick={() => handleClickPost(post.id)}
            >
              <Slider {...sliderSettings}>
                {Array.isArray(post.imageUrl) ? (
                  post.imageUrl.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Post ${index + 1}`} />
                    </div>
                  ))
                ) : (
                  <div>
                    <img src={post.imageUrl} alt={`Post ${post.id}`} />
                  </div>
                )}
              </Slider>
              {selectedPost === post.id && (
                <UserComment
                  key={post.id}
                  imageUrl={
                    Array.isArray(post.imageUrl)
                      ? post.imageUrl[0]
                      : post.imageUrl
                  }
                  profilePicutre={profilePicture}
                  username={username}
                />
              )}
            </div>
          ))}
      </div>

      {selectedPost && (
        <div className="page-overlay" onClick={() => setSelectedPost(null)}>
          {/* Additional content for the page overlay */}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
