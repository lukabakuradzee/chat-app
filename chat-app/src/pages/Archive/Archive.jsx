import React from 'react';

const Archive = ({ savedPosts = [] }) => {
  console.log("Saved Posts in archive", savedPosts);

  return (
    <div className="archive-container">
      <h2>Saved Posts</h2>
      <div className="saved-posts-container">
        {savedPosts.map((savedPost, index) => (
          <div key={index} className="saved-post">
            <img src={savedPost.imageUrl} alt={`Saved Post ${index + 1}`} />
            {/* Add other necessary details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
