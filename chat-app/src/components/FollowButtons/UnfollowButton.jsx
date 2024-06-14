import React, { useState } from 'react';
import { userUnFollow } from '../../api/services/userServices';

function UnfollowButton({ userId, unFollow }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unfollow, setUnfollow] = useState(false);

  const handleUnFollowUser = async () => {
    try {
      setLoading(true);
      const unfollowUser = await userUnFollow(userId);
      setUnfollow(unfollowUser);
      console.log('Unfollow user', unfollowUser);
      setError('');
      unFollow();
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
      <button onClick={handleUnFollowUser} disabled={unfollow}>
      {loading ? 'Unfollowing...' : 'Unfollow'}
      </button>
    </div>
  );
}

export default UnfollowButton;
