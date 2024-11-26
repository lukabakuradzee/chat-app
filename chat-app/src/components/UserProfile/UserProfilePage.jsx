import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import LogoutButton from '../LogoutButton/LogoutButton';
import { Link } from 'react-router-dom';
import UserPosts from './UserPosts';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import CreatePost from './CreatePost';
import {
  fetchFollowingUsers,
  fetchUserFollowers,
} from '../../api/services/userServices';
import Notification from '../Notification/Notification';
import { NOTIFICATION } from '../../constants/routes';
import { BarLoader } from 'react-spinners';
import CreateStory from '../Stories/CreateStory';
import Stories from '../Stories/Stories';

const UserProfilePage = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  console.log("User:" , state)

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true); 
        const followersData = await fetchUserFollowers(user.userId);
        const followingData = await fetchFollowingUsers(user.userId);
        setFollowers(followersData);
        setFollowing(followingData);
        setError('');
        console.log('followers: ', followersData);
        console.log('FOLLOWING USER PAGE: ', followingData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };
    fetchFollowers();
  }, [user.userId]);

  useEscapeKeyHandler(() => setShowCreatePost(false));

  if (loading)
    return (
      <div className="bar-loader">
        <BarLoader color="#fe3c72" />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.userAvatar} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1>@{user.username}</h1>
          <div className="profile-stats">
            {/* <UserFollowers userId={user.userId}/> */}
            <span>{posts.length} posts</span>
            <span>{followers ? followers.length : 0} followers</span>
            <span>{following ? following.length : 0} following</span>
          </div>
          <div className="profile-actions">
            <Link to={`/accounts/${user.username}/edit`}>
              <button>Edit Profile</button>
            </Link>
            <button>View Archive</button>
            <LogoutButton dispatch={dispatch} />
          </div>
        </div>
        <Link to={NOTIFICATION}>
          <div className="notification-modal">
            <i className="fa-regular fa-heart notifications-icon" />
          </div>
        </Link>
      </div>
      <div
        className="create-post-button-container"
        onClick={() => setShowCreatePost(!showCreatePost)}
      >
        <i className="fa-regular fa-square-plus create-post-icon"></i>
        Create Post
      </div>
      {showCreatePost && (
        <div
          className="page-overlay"
          // onClick={() => handleAttachmentBoxToggle()}
        >
          <>
            <CreatePost
              user={user}
              setPosts={setPosts}
              onClose={() => setShowCreatePost(false)}
            />
          </>
        </div>
      )}

      <div className="profile-posts">
        <UserPosts username={user.username} posts={posts} setPosts={setPosts} />
      </div>
      <Notification />
      <CreateStory/>
      <Stories/>
    </div>
  );
};

export default UserProfilePage;
