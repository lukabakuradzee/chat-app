import React from 'react';

const UserPageContainer = () => {
  // Sample user data
  const user = {
    username: 'luka92',
    profilePicture:
      'https://st3.depositphotos.com/1017228/18878/i/450/depositphotos_188781580-stock-photo-handsome-cheerful-young-man-standing.jpg',
    userPosts: 32,
    followersCount: 100,
    followingCount: 50,
  };

  // Sample array of posts
  const posts = [
    {
      id: 1,
      imageUrl:
      "https://static.photocrowd.com/upl/kD/cms.CZEIHIQ_-STGXv3K5VXw-hd.jpeg",
      caption: 'Beautiful sunset!',
    },
    {
      id: 2,
      imageUrl:
        "https://www.thewholeworldisaplayground.com/wp-content/uploads/2019/01/Italy-Florence-Best-Photo-Locations-2.webp",
      caption: 'Exploring nature!',
    },
    {
      id: 3,
      imageUrl:
        "https://cdmtridentonline.com/wp-content/uploads/2020/02/kiana--900x506.jpg",
      caption: 'Having fun at the beach!',
    },
    {
      id: 4,
      imageUrl:
      "https://iso.500px.com/wp-content/uploads/2015/09/streetcover1.jpeg",
      caption: 'Having fun at the beach!',
    },
    {
      id: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1610247948543-28d438fd094b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
      caption: 'Having fun at the beach!',
    },
    {
      id: 6,
      imageUrl:
        "https://www.photographynews.co.uk/wp-content/uploads/tom-parsons-ow_3Zc8xSN4-unsplash.jpg",
      caption: 'Having fun at the beach!',
    },
  ];

  return <UserProfilePage {...user} posts={posts} />;
};

const UserProfilePage = ({
  username,
  profilePicture,
  userPosts,
  followersCount,
  followingCount,
  posts,
}) => {
  return (
    <div className="user-profile-info">
      <div className="profile-header">
        <div className="user-photo-header">
          <img src={profilePicture} alt="Profile" />
          <h1>{username}</h1>
          <div>
            <button className="edit-profile-user-btn">Edit Profile</button>
            <button className="view-archive-profile-user">View archive</button>
          </div>
          <div className="follow-info">
            <span>{userPosts} posts</span>
            <span>{followersCount} followers</span>
            <span>{followingCount} following</span>
          </div>
        </div>
      </div>
      <h2><i class="fa-solid fa-table-cells"></i>Posts</h2>
      <div className="user-posts">
        {posts &&
          posts.map((post) => (
              <div key={post.id} className="post">
                <img src={post.imageUrl} alt="Post" />
                {/* {/* <p>{post.caption}</p> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserPageContainer;
