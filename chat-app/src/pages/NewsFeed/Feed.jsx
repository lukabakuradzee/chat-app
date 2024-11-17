import React, { useEffect, useState } from 'react';
import { fetchAllUsersPosts } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function Feed() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserPostData = async () => {
      try {
        const response = await fetchAllUsersPosts();
        console.log('response data: ', response);
        const sortedData = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setPosts(sortedData);
        setMessage(response.message);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPostData();
  }, []);

  return (
    <div>
      {loading && (
        <div className="bar-loader">
          <BarLoader color="#fe3c72" />
        </div>
      )}
      <section className="user_posts_container">
        {posts.map((post) => (
          <div key={post._id} className="feed_user_box">
            <div className="user_feed_info">
              <img
                className="user_feed_username_avatar"
                src={post.user.avatar}
                alt=""
              />
              <Link>
                <h2>{post.user.username} <span>&#183; {post.timeElapsed}</span></h2>
                
              </Link>
              
            </div>
            <div className="image_container_user_box">
              <img src={post.image} alt="" />
              <h3>{post.caption}</h3>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Feed;
