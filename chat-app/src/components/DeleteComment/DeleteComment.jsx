import React, { useState } from 'react';
import { deleteUserComment } from '../../api/services/userServices';

const DeleteComment = ({ postId, commentId, onCommentDeleted }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await deleteUserComment(postId, commentId);
      onCommentDeleted(commentId); // Notify parent component about the deletion
      console.log('Comment deleted successfully:', data);
    } catch (error) {
      setError('Error while deleting comment');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleDelete} className="btn-delete">
          Delete Comment
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteComment;
