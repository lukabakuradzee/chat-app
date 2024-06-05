// PostDetail.js

import React from 'react';

const PostDetail = ({ post }) => {
  return (
    <div className="post-detail">
       <div className="post-detail-image-box">
      <img src={post.image} alt="Post" className="post-detail-image" />
        </div> 
      <div className="post-detail-info">
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
