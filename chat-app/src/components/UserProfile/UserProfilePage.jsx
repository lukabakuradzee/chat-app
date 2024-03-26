import { useEffect, useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import UserComment from './UserComment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import { sliderSettings } from '../Slider/Slider';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { ARCHIVE } from '../../constants/routes';
import { usersData, usersPosts } from '../../api/users';
import { RingLoader } from 'react-spinners';

const UserProfilePage = () => {
  const { state } = useAuthContext();
  const { user } = state;
  const [selectedPost, setSelectedPost] = useState(null);
  // const [savedPosts, setSavedPosts] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [usersPostsFetch, setUserPostsFetch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        // Fetch both users and posts concurrently
        const [users, posts] = await Promise.all([usersData(), usersPosts()]);
        setUsersInfo(users);
        setUserPostsFetch(posts);
      } catch (error) {
        setError('Error while fetching data: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(usersInfo)


  const handleClickPost = (postId) => {
    setSelectedPost(postId === selectedPost ? null : postId);
  };

  // const handleMoveArchive = (postId) => {
  //   const postToArchive = posts.find((post) => post.id === postId);
  //   if (postToArchive) {
  //     setSavedPosts((prevSavedPosts) => [...prevSavedPosts, postToArchive]);
  //     alert('Post added to archive');
  //   }
  // };

  useEscapeKeyHandler(() => setSelectedPost(false));

  return (
    <div className="user-profile-info">
      
      {usersInfo.map((user) => (
          <div className="profile-header">
            <div className="user-photo-header">
              <img src={user.profilePicture} alt="Profile" />
              <h1>{user.username}</h1>
              <div className="btn-container-user-profile">
                <button className="edit-profile-user-btn">
                <Link to={`/accounts/${user.userName}/edit`}>Edit Profile</Link>
              </button>
                <button className="view-archive-profile-user">
                  <Link to={ARCHIVE}>View archive</Link>
                </button>
              </div>
              <div className="follow-info">
                <span>{user.userPosts} posts</span>
                <span>{user.followersCount} followers</span>
                <span>{user.followingCount} following</span>
              </div>
            </div>
          </div>
        ))}

      <h2>
        <i className="fa-solid fa-table-cells"></i>Posts
      </h2>

      <div className="user-posts">
        {usersPostsFetch.map((post) => (
          <div
            key={post.id}
            className="post"
            onClick={() => handleClickPost(post.id)}
          >
            <i
              className="fa-regular fa-bookmark saved-posts-icon"
              // onClick={() => handleMoveArchive(post.id)}
            ></i>
            <Slider {...sliderSettings}>
              {Array.isArray(post.imageUrl) ? (
                post.imageUrl.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Post ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div>
                  <img src={post.imageUrl} alt={`Post ${post.id}`} />
                </div>
              )}
            </Slider>
            {selectedPost === post.id && (
              <UserComment
                key={post.id}
                imageUrl={
                  Array.isArray(post.imageUrl)
                    ? post.imageUrl[0]
                    : post.imageUrl
                }
                // username={username}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        {error && <h2>{error}</h2>}
        {loading && (
          <div className="bar-loader" style={{}}>
            <RingLoader color="#fe3c72" />
          </div>
        )}
        {/* <div className="users-info-api">
          {usersInfo.map((user) => (
            <div key={user.id}>
            <h2>Name: {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <p>State: {user.address.state}</p>
            <p>Address: {user.address.city}</p>
            <p>Street: {user.address.street}</p>
              <span>Interests: {user.interests.join(', ')}</span>
              </div>
              ))}
            </div> */}
      </div>

      {selectedPost && (
        <div className="page-overlay" onClick={() => setSelectedPost(null)}>
          {/* Additional content for the page overlay */}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
