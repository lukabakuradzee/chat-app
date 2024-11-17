const calculateTimeElapsed = (createdAt) => {
  const now = new Date();
  const postDate = new Date(createdAt);
  const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    // Less than 1 day
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays} days ago`;
  }
};


module.exports = calculateTimeElapsed;
