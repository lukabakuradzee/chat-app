import React from 'react';

const UserPageContainer = () => {
  // Sample user data
  const user = {
    username: 'lukaa_92',
    profilePicture: 'https://st3.depositphotos.com/1017228/18878/i/450/depositphotos_188781580-stock-photo-handsome-cheerful-young-man-standing.jpg',
    followersCount: 100,
    followingCount: 50,
  };

  // Sample array of posts
  const posts = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1591909225194-3b804fc84477?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhdXRpZnVsJTIwc3Vuc2V0fGVufDB8fDB8fHww',
      caption: 'Beautiful sunset!',
    },
    {
      id: 2,
      imageUrl: 'https://as2.ftcdn.net/v2/jpg/04/13/92/53/1000_F_413925387_tHUX1eqBvqdQmGRJK09OktrDa89NPrR8.jpg',
      caption: 'Exploring nature!',
    },
    {
      id: 3,
      imageUrl: 'https://us.images.westend61.de/0001061131pw/group-of-friends-having-fun-on-the-beach-running-into-the-water-WPEF01049.jpg',
      caption: 'Having fun at the beach!',
    }, {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1591909225194-3b804fc84477?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhdXRpZnVsJTIwc3Vuc2V0fGVufDB8fDB8fHww',
        caption: 'Beautiful sunset!',
      },
      {
        id: 2,
        imageUrl: 'https://as2.ftcdn.net/v2/jpg/04/13/92/53/1000_F_413925387_tHUX1eqBvqdQmGRJK09OktrDa89NPrR8.jpg',
        caption: 'Exploring nature!',
      },
      {
        id: 3,
        imageUrl: 'https://us.images.westend61.de/0001061131pw/group-of-friends-having-fun-on-the-beach-running-into-the-water-WPEF01049.jpg',
        caption: 'Having fun at the beach!',
      },
];


return <UserProfilePage {...user} posts={posts} />;
};


const UserProfilePage = ({
  username,
  profilePicture,
  bio,
  followersCount,
  followingCount,
  posts,
}) => {
  return (
    <div className="user-profile-info">
      <div className="profile-header">
        <img src={profilePicture} alt="Profile" />
        <h1>{username}</h1>
        <div className="follow-info">
          <span>{followersCount} followers</span>
          <span>{followingCount} following</span>
        </div>
      </div>
      <div className="user-posts">
        <h2>Posts</h2>
        {posts &&
          posts.map((post) => (
            <div className="posts-grid">
              <div key={post.id} className="post">
                  <img src={post.imageUrl} alt="Post" />
                  {/* {/* <p>{post.caption}</p> */}
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserPageContainer;


