import React, { useState, useEffect } from 'react';
import { userLikes } from '../../api/services/userServices';

const Like = ({ postId, user }) => {
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLiked(likes.some(like => like.userId === user.userId));
  }, [likes, user.userId]);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true);
      try {
        const updatedLikes = await userLikes(postId, user.userId);
        if (updatedLikes && updatedLikes.likes) {
          setLikes(updatedLikes.likes);
          setIsLiked(updatedLikes.likes.some(like => like.userId === user.userId));
        } else {
          setError('Failed to fetch likes');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postId, user.userId]);

  const handleUserLike = async () => {
    try {
      setLoading(true);
      setError('');
      const updatedLikes = await userLikes(postId, user.userId);
      if (updatedLikes && updatedLikes.likes) {
        setLikes(updatedLikes.likes);
        setIsLiked(updatedLikes.likes.some(like => like.userId === user.userId));
      } else {
        setError('Failed to update likes');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span onClick={handleUserLike} className="cursor-pointer">
        <i className={`fa-heart ${isLiked ? 'fa-solid text-red-500' : 'fa-regular'}`}></i>
      </span>
      <p className="mt-10">Likes: {likes.length}</p>
      <div>
        <p className="font-semibold">Liked by:</p>
        <ul className="list-disc list-inside">
          {likes.map((like, index) => (
            <div key={index} className='user-like-box'>
              <div>
                <img src={user.userAvatar} alt="" />
              </div>
            <li className="text-red-500">
              {like.username}
            </li>
            </div>
          ))}
        </ul>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Like;
