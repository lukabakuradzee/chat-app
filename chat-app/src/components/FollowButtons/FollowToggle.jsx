import React, { useState, useEffect } from 'react';
import { userFollow, userUnFollow } from '../../api/services/userServices';

const FollowButton = ({ userId, onFollow, onUnfollow, isInitiallyFollowed }) => {
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(isInitiallyFollowed);
  const [error, setError] = useState('');

  useEffect(() => {
    setFollowed(isInitiallyFollowed);
  }, [isInitiallyFollowed]);


  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (followed) {
        await userUnFollow(userId);
        setFollowed(false);
        onUnfollow();
      } else {
        await userFollow(userId);
        setFollowed(true);
        onFollow();
      }
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
      <button onClick={handleFollowToggle} disabled={loading}>
      {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

export default FollowButton;
