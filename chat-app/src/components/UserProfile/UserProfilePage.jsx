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
import { personInfo } from '../../api/users';

const UserProfilePage = () => {
  const { state } = useAuthContext();
  const { user } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [usersInfo, setUsersInfo] = useState([]);
  const [usersPostsFetch, setUserPostsFetch] = useState([]);
  const [personInfoData, setPersonInfoData] = useState([])
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        // Fetch both users and posts concurrently
        const [users, posts, persons] = await Promise.all([usersData(), usersPosts(), personInfo()]);
        setUsersInfo(users);
        setUserPostsFetch(posts);
        setPersonInfoData(persons)
      } catch (error) {
        setError('Error while fetching data: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  console.log("Person Info: ", personInfo);
  console.log("User Posts", usersPostsFetch);

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
      {usersInfo.map((userApi) => (
        <div className="profile-header">
          <div className="user-photo-header">
            <img src={userApi.profilePicture} alt="Profile" />
            <h1>{userApi.username}</h1>
            <div className="btn-container-user-profile">
              <button className="edit-profile-user-btn">
                <Link to={`/accounts/${user.userName}/edit`}>Edit Profile</Link>
              </button>
              <button className="view-archive-profile-user">
                <Link to={ARCHIVE}>View archive</Link>
              </button>
            </div>
            <div className="follow-info">
              <span>{userApi.userPosts} posts</span>
              <span>{userApi.followersCount} followers</span>
              <span>{userApi.followingCount} following</span>
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
        <div className="users-info-api">
          {personInfoData.map((person) => (
            <div key={person.id}>
            <h2>Name: {person.name}</h2>
            <p>Email: {person.email}</p>
            <p>Age: {person.age}</p>
            <p>State: {person.address.state}</p>
            <p>Address: {person.address.city}</p>
            <p>Street: {person.address.street}</p>
              <span>Interests: {person.interests.join(', ')}</span>
              </div>
              ))}
            </div>
      </div>

      {selectedPost && (
        <div className="page-overlay" onClick={() => setSelectedPost(null)}>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
