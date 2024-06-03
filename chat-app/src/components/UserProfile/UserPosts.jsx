import React, { useEffect, useState } from 'react';
// import { fetchUserPosts } from '../../api/services/userServices';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const UserPosts = ({ userId }) => {
 const {state} = useAuthContext();
 const {user} = state;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchUserPosts = async () => {
  const url = `https://localhost:5500/api/users/posts/${user.userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    console.log(`Bearer ${localStorage.getItem('accessToken')}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    console.log('User id: ', userId);
    console.log('Data: ', data);
  } catch (error) {
    throw new Error(error.message);
  }
};

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchUserPosts();
        setPosts(data);
        setLoading(false);
        console.log("Data: ", data)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    getPosts();
  }, [user.userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

    return (
      <div className="container">
        <div className="gallery">
          {posts.map((post) => (
            <div className="gallery-item" key={post._id}>
              <img src={post.image} alt="Post" className="gallery-image" />
              {/* <div className="gallery-item-info">
                <ul>
                  <li className="gallery-item-likes">
                    <span className="visually-hidden">Likes:</span>
                    <i className="fas fa-heart" aria-hidden="true"></i> {post.likes}
                  </li>
                  <li className="gallery-item-comments">
                    <span className="visually-hidden">Comments:</span>
                    <i className="fas fa-comment" aria-hidden="true"></i> {post.comments}
                  </li>
                </ul>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    );
};

export default UserPosts;
