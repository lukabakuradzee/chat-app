import React, { useEffect, useState } from 'react';
import { fetchAllUsersPosts } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import Counter from '../../components/Counter/Counter';
import styles from '../NewsFeed/Feed.module.scss'

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
        const sortedData = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setPosts(sortedData);
        console.log("sorted data: ", sortedData)
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
        <div className={styles.loader_bar}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
      {message && <div>{message}</div>}
      <section className={styles.feedContainer}>
        {posts.map((post) => (
          <div key={post._id} className={styles.feedBox}>
            <div className={styles.feedInfo}>
              <Link to={`/profile/${post.user.username}`}>
                <img
                  className={styles.feedAvatar} src={post.user.avatar}
                  alt={`${post.user.username}'s avatar`}
                />
              </Link>
              <Link to={`/profile/${post.user.username}`}>
                <h2 className={styles.feedUsername}>
                  {post.user.username} <span>&#183; {post.timeElapsed}</span>
                </h2>
              </Link>
            </div>

            <div className={styles.mediaContainer}>
              {post.image ? (
                <img src={post.image} alt="Post" />
              ) : post.video ? (
                <video src={post.video} controls />
              ) : null}
              <h3 className={styles.caption}>{post.caption}</h3>
            </div>
          </div>
        ))}
      </section>
      {/* <Counter/> */}
    </div>
  );
}



export default Feed;
