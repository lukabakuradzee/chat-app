import React, { useState } from 'react';
import { createNewPost } from '../../api/services/userServices';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';

const CreatePost = ({ user, setPosts, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

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

        const createdPost = await createNewPost(formData);
        // Check if createdPost is returned correctly
        console.log('Created Post:', createdPost);

        setPosts((prevPosts) => {
          console.log('Previous Posts:', prevPosts);
          return [createdPost, ...prevPosts];
        });

        setCaption('');
        setImageFile(null);
        setError('');
        setLoading(false);
        onClose();
        // setShowCreatePost(false);
      },
      setLoading,
      (error) => setMessage(error.message),
    );
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleCreatePost} style={{ marginBottom: '2em' }}>
        <div>
          <label htmlFor="description">Caption:</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
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
  );
};

export default CreatePost;
