import React from 'react';
import UserProfilePage from './UserProfilePage';

const UserPageContainer = () => {
  // User data
  const user = {
    username: 'luka92',
    profilePicture:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?cs=srgb&dl=pexels-stefan-stefancik-91227.jpg&fm=jpg",
    userPosts: 6,
    followersCount: 100,
    followingCount: 50,
  };

  // Sample array of posts
  const posts = [
    {
      id: 1,
      imageUrl:
        'https://static.photocrowd.com/upl/kD/cms.CZEIHIQ_-STGXv3K5VXw-hd.jpeg',
      caption: 'Beautiful sunset!',
    },
    {
      id: 2,
      imageUrl:
        'https://www.thewholeworldisaplayground.com/wp-content/uploads/2019/01/Italy-Florence-Best-Photo-Locations-2.webp',
      caption: 'Exploring nature!',
    },
    {
      id: 3,
      imageUrl:
        'https://cdmtridentonline.com/wp-content/uploads/2020/02/kiana--900x506.jpg',
      caption: 'Having fun at the beach!',
    },
    {
      id: 4,
      imageUrl:
        'https://iso.500px.com/wp-content/uploads/2015/09/streetcover1.jpeg',
      caption: 'Having fun at the beach!',
    },
    {
      id: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1610247948543-28d438fd094b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D',
      caption: 'Having fun at the beach!',
    },
    {
      id: 6,
      imageUrl:
        'https://www.photographynews.co.uk/wp-content/uploads/tom-parsons-ow_3Zc8xSN4-unsplash.jpg',
      caption: 'Having fun at the beach!',
    },
  ];

  return <UserProfilePage {...user} posts={posts} />;
};


export default UserPageContainer;