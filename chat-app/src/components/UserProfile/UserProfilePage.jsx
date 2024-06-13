import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import LogoutButton from '../LogoutButton/LogoutButton';
import { Link } from 'react-router-dom';
import UserPosts from './UserPosts';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import CreatePost from './CreatePost';
import { fetchFollowingUsers, fetchUserFollowers } from '../../api/services/userServices';


const UserProfilePage = () => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

    useEffect(() => {
      const fetchFollowers = async () => {
        try {
          setLoading(true); // Start loading
          const followersData = await fetchUserFollowers(user.userId);
          const followingData = await fetchFollowingUsers(user.userId)
          setFollowers(followersData);
          setFollowing(followingData);
          setError('');
          console.log("followers: ", followersData);
          console.log("following: ", followingData);
        } catch (error) {
          console.error(error);
          setError(error.message);
        } finally {
          setLoading(false); // End loading
        }
      };
      fetchFollowers();
    }, [user.userId]);
  



  useEscapeKeyHandler(() => setShowCreatePost(false));
  if(loading) return <p>Loading...</p>
  if(error) return <p>{error}</p>


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
