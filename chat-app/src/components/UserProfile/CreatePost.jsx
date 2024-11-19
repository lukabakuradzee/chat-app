import React, { useState } from 'react';
import { createNewPost } from '../../api/services/userServices';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';

const CreatePost = ({ user, setPosts, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setVideoFile(null); // Clear video if a new image is selected
      } else if (file.type === 'video/mp4') {
        setVideoFile(file);
        setImageFile(null); // Clear image if a new video is selected
      } else {
        alert('Only images and MP4 videos are allowed.');
      }
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('userId', user.userId);
        
        if(imageFile) {
          formData.append('image', imageFile)
        }

        if(videoFile) {
          formData.append('video', videoFile);
        }


        const createdPost = await createNewPost(formData);

        setPosts((prevPosts) => [createdPost, ...prevPosts]);
        setCaption('');
        setImageFile(null);
        setVideoFile(null);
        setError('');
        setLoading(false);
        onClose();
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
            accept="image/*,video/mp4"
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
