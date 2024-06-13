import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getUserProfile,
  getUserPosts,
  getUserFollower,
  getUserFollowing,
} from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import CreatePost from './CreatePost';
import OtherUserPosts from './OtherUsersPosts';

const OtherUserProfile = () => {
  const { state } = useAuthContext();
  const { user } = state;
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile(username);
        const userPosts = await getUserPosts(username);
        const userFollowers = await getUserFollower(username);
        const userFollowing = await getUserFollowing(username);
        setUserData(userProfile);
        setPosts(userPosts);
        setFollowers(userFollowers);
        setFollowing(userFollowing);
        console.log('User followers: ', userFollowers);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={userData.avatar} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1>@{userData.username}</h1>
          <div className="profile-stats">
            {/* <UserFollowers userId={user.userId}/> */}
            <span>{posts.length} posts</span>
            <span>{followers ? followers.length : 0} followers</span>
            <span>{following.length} following</span>
          </div>
          <div className="profile-actions">
            {/* <Link to={`/accounts/${user.username}/edit`}>
            <button>Edit Profile</button>
          </Link>
          <button>View Archive</button>
          <LogoutButton dispatch={dispatch} /> */}
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
            <CreatePost
              user={user}
              setPosts={setPosts}
              onClose={() => setShowCreatePost(false)}
            />
          </>
        </div>
      )}

      <div className="profile-posts">
        <OtherUserPosts posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
};

export default OtherUserProfile;
