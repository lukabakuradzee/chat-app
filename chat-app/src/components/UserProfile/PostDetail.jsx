import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import UserComment from './UserComment';
import Like from '../LikeButton/LikeButton';
import DeleteComment from '../DeleteComment/DeleteComment';

const PostDetail = ({ post }) => {
  const { state } = useAuthContext();
  const { user } = state;
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  return (
    <div className="post-detail p-4 bg-black rounded-lg shadow-md">
      <div className="post-detail-image-box">
        <img
          src={post.image}
          alt="Post"
          className="post-detail-image w-full h-auto rounded-lg"
        />
      </div>
      <div className="post-detail-info mt-4">
        <div className="post-detail-userinfo flex items-end">
          <div className="post-detail-image-box w-10 h-10 rounded-full overflow-hidden">
            <img src={user.userAvatar} alt="" />
          </div>
          <p className="ml-4">{user.username}</p>
        </div>
        <div className='user-caption'>
          <div><img src={user.userAvatar} alt="" /></div>
          <p>{user.username} <span>{post.caption}</span></p>
        </div>
        
        <UserComment postId={post._id} comments={comments} addComment={handleAddComment} />
        <Like postId={post._id} user={user}/>
        <DeleteComment postId={post._id} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PostDetail;
