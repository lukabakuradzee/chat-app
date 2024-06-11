import React, { useState } from 'react';
import { deleteUserPosts } from '../../api/services/userServices';

function DeletePost({ postId , onDelete}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleDeletePost = async () => {
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const result = await deleteUserPosts(postId);
      onDelete(postId)
      setSuccess(result.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='delete-user-post'>
      <button  onClick={handleDeletePost}>
        {loading ? 'Delete' : 'Delete Post'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default DeletePost;
