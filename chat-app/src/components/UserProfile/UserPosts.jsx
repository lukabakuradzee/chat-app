import React, { useEffect, useState } from 'react';
// import { fetchUserPosts } from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { fetchUserPosts } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import DeletePost from './DeletePost';
import PostDetail from './PostDetail';

const UserPosts = () => {
  const { state } = useAuthContext();
  const { user } = state;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // Track the selected post for modal display


  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchUserPosts(user.userId);
        setPosts(data);
        console.log('Data', data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    getPosts();
  }, [user.userId]);

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  }


  const handlePostClick = (post) => {
    setSelectedPost(post)
  };

  const closeModal = () => {
    // Close the modal by resetting the selected post
    setSelectedPost(null);
  };

  if (loading)
    return (
      <div className="bar-loader" style={{}}>
        <BarLoader color="#fe3c72" />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="gallery">
        {posts.map((post) => (
          <div className="gallery-item" key={post._id} >
            <img src={post.image} alt="Post" onClick={() => handlePostClick(post)} className="gallery-image" />
            <div className="gallery-item-info">
              <ul>
                <li className="gallery-item-likes">
                  <span className="visually-hidden">Likes:</span>
                  <i className="fas fa-heart" aria-hidden="true"></i>{' '}
                  {post.likes}
                </li>
                <li className="gallery-item-comments">
                  <span className="visually-hidden">Comments:</span>
                  <i className="fas fa-comment" aria-hidden="true"></i>{' '}
                  {post.comments}
                </li>
              </ul>
              <DeletePost postId={post._id} onDelete={handleDelete} />
            </div>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <PostDetail post={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
