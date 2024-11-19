import React, { useState } from 'react';
import { BarLoader } from 'react-spinners';
import DeletePost from './DeletePost';
import PostDetail from './PostDetail'; 
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';


const OtherUserPosts = ({ posts, setPosts }) => {
  const [selectedPost, setSelectedPost] = useState(null); // Track the selected post for modal display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEscapeKeyHandler(closeModal);

  if (loading)
    return (
      <div className="bar-loader" style={{}}>
        <BarLoader color="#fe3c72" />
      </div>
    );
  if (error)  return <p>{error}</p>;

  return (
    <div className="container">
      <div className="gallery">
        {posts.map((post) => (
          <div className="gallery-item" key={post._id}>
           {post.image ? (
              <img src={post.image} alt="Post" className="gallery-image" />
            ) : post.video ? (
              <video src={post.video} controls className="gallery-video" />
            ) : null}
            <div className="gallery-item-info">
              <DeletePost postId={post._id} onDelete={handleDelete} />
            </div>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PostDetail post={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherUserPosts;
