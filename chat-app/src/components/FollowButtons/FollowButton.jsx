import React, { useState } from 'react';
import { userFollow } from '../../api/services/userServices';

function FollowButton({ userId }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  const handleFollowUser = async () => {
    try {
      setLoading(true);
      await userFollow(userId);
      setFollowed(true);
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>following...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <button onClick={handleFollowUser} disabled={followed}>
        {followed ? 'following' : 'follow'}
      </button>
    </div>
  );
}

export default FollowButton;
