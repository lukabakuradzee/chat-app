import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUserProfile,
  getUserPosts,
  getUserFollower,
  getUserFollowing,
  fetchFollowStatus,
} from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import OtherUserPosts from './OtherUsersPosts';
import FollowButton from '../FollowButtons/FollowToggle';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { BarLoader } from 'react-spinners';

const OtherUserProfile = ({ userId }) => {
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
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEscapeKeyHandler(() => setShowCreatePost());

  useEffect(() => {
    if (username === user.username) {
      navigate(`/${user.username}`, { replace: true });
    }
    console.log('username: ', user.username);
  }, [user.username, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile(username);
        const userPosts = await getUserPosts(username);
        const sortedPosts = userPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        const userFollowers = await getUserFollower(username);
        const followStatus = await fetchFollowStatus(username);
        const userFollowing = await getUserFollowing(username);
        setUserData(userProfile);
        setPosts(sortedPosts);
        setFollowers(userFollowers);
        setFollowing(userFollowing);
        setIsFollowing(followStatus.isFollowing);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, userId]);

  const handleFollow = () => {
    setFollowers((prevFollowers) => [...prevFollowers, user]);
    setIsFollowing(true);
  };

  const handleUnfollow = () => {
    setFollowers((prevFollowers) =>
      prevFollowers.filter((follower) => follower._id !== user._id),
    );
    setIsFollowing(false);
  };

  if (loading) {
    return (
      <div className="bar-loader">
        <BarLoader color="#fe3c72" />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-header other_user_profile_header">
        <img src={userData.avatar} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1>@{userData.username}</h1>
          <div className="profile-stats">
            {/* <UserFollowers userId={user.userId}/> */}
            <span>{posts.length} posts</span>
            <span>{followers ? followers.length : 0} followers</span>
            <span>{following.length ? following.length : 0} following</span>
          </div>
          <div className="profile-actions">
            <FollowButton
              userId={userData._id}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              isInitiallyFollowed={isFollowing}
            />

            {/* <LogoutButton dispatch={dispatch} /> */}
          </div>
        </div>
      </div>
      <div className="profile-posts">
        <OtherUserPosts posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
};

export default OtherUserProfile;
