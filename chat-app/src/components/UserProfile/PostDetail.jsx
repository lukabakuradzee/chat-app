// PostDetail.js
import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const PostDetail = ({ post }) => {
    const {state} = useAuthContext();
    const {user} = state;


  return (
    <div className="post-detail">
       <div className="post-detail-image-box">
      <img src={post.image} alt="Post" className="post-detail-image" />
        </div> 
      <div className="post-detail-info">
        <div className='post-detail-userinfo'>
        <div className='post-detail-image-box'><img src={user.userAvatar} alt="" /></div>
        <p>{user.username}</p>
        </div>
        
        <p>{post.description}</p>
        <p>Username: {post.username}</p>
        <p>Likes: {post.likes}</p>
        <p>Comments: {post.comments}</p>
        {/* Add comments section here */}
      </div>
    </div>
  );
};

export default PostDetail;
