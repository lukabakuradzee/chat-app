import React, { useState, useEffect } from 'react';
import { fetchUserFollowers } from '../../api/services/userServices';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';

const UserFollowers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFollowUser = async () => {
    await handleAsyncOperation(async () => {
        const followers = await fetchUserFollowers(userId);
        setFollowers(followers);

    }, setLoading, (error) => setMessage(error.message)) 
   
  };

  useEffect(() => {
    handleFollowUser();
  }, [userId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      <ul>
        {followers.map((follower) => (
          <li key={follower.id}>{follower.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserFollowers;
