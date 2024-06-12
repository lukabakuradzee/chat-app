import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import LogoutButton from '../LogoutButton/LogoutButton';
import { Link } from 'react-router-dom';
import UserPosts from './UserPosts';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import CreatePost from './CreatePost';


const UserProfilePage = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // const [followers, setFollowers] = useState(null);

  useEffect(() => {
    if (showCreatePost) {
      console.log('ShowCreatedPost', showCreatePost);
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll'); // Clean up on unmount
  }, [showCreatePost]);



  useEscapeKeyHandler(() => setShowCreatePost(false));

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.userAvatar} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1>{user.username}</h1>
          <div className="profile-stats">
            {/* <UserFollowers userId={user.userId}/> */}
            <span>{posts.length} posts</span>
            <span>{user.followers} followers</span>
            <span>{user.following} following</span>
          </div>
          <div className="profile-actions">
            <Link to={`/accounts/${user.username}/edit`}>
              <button>Edit Profile</button>
            </Link>
            <button>View Archive</button>
            <LogoutButton dispatch={dispatch} />
          </div>
        </div>
      </div>
      <div
        className="create-post-button-container"
        onClick={() => setShowCreatePost(!showCreatePost)}
      >
        <i class="fa-regular fa-square-plus create-post-icon"></i>
        Create Post
      </div>
      {showCreatePost && (
        <div
          className="page-overlay"
          // onClick={() => handleAttachmentBoxToggle()}
        >
          <>
            <CreatePost user={user} setPosts={setPosts} onClose={() => setShowCreatePost(false)}/>
          </>
        </div>
      )}

      <div className="profile-posts">
        <UserPosts username={user.username} posts={posts} setPosts={setPosts}/>
      </div>
    </div>
  );
};

export default UserProfilePage;
