import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { getUserComment, postUserComment } from '../../api/services/userServices';

const UserComment = ({ postId, comments, addComment }) => {
  const { state } = useAuthContext();
  const { user } = state;
  const [commentText, setCommentText] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await getUserComment(postId);
        setUserComments(fetchedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId, addComment]);

  const handleUserComment = async () => {
    setLoading(true);
    setError('');
    try {
      const newComment = await postUserComment(postId, user.userId, commentText);
      setUserComments(prevComments => [...prevComments, newComment]);
      addComment(newComment); // Update the parent component's state
      console.log('New Comment: ', newComment);
      setCommentText('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-component">
      <div className="comment-list">
        {userComments.map((comment, index) => (
          <div className="comment-item" key={index}>
            <p><span className='comment-username'>{user.username}</span> {comment.text}</p>
          </div>
        ))}
      </div>
      <div className="comment-input">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleUserComment} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UserComment;
