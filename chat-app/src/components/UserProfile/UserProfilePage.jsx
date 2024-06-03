import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { createNewPost } from '../../api/services/userServices';
import LogoutButton from '../LogoutButton/LogoutButton';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import { Link } from 'react-router-dom';
import UserPosts from './UserPosts';

const UserProfilePage = ({ userId }) => {
  const { state, dispatch } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', imageFile);
        formData.append('userId', user.userId);
        setMessage('Post created');
        console.log('Form data: ', formData);

        const createdPost = await createNewPost(formData);
        setPosts((prevPosts) => [createdPost, ...prevPosts]);
        setCaption('');
        setImageFile(null);
        setError('');
        setLoading(false);
      },
      setLoading,
      (error) => setMessage(error.message),
    );
  };


  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.userAvatar} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1>{user.username}</h1>
          <div className="profile-stats">
            {/* <span>{user.posts.length} posts</span> */}
            {/* <span>{user.followers.length} followers</span>
            <span>{user.following.length} following</span> */}
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
      <div className="create-post">
        <h2>Create New Post</h2>
        <form onSubmit={handleCreatePost} style={{ marginBottom: '2em' }}>
          <div>
            <label htmlFor="caption">Caption:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Upload Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
          {message && <p>{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="profile-posts">
        <UserPosts userId={userId} />
      </div>
    </div>
  );
};

export default UserProfilePage;
