import React from 'react';
import { useState, useEffect } from 'react';

const CreateMessage = () => {
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const toggleCreateMessage = () => {
    setShowCreateMessage((prevState) => !prevState);
  };

  const handleKeyDown = (event) => {
    setShowCreateMessage(false)
    if (event.key === 'Escape') {
      setShowCreateMessage(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <i
        className="fa-solid fa-pen-to-square user-info-edit-icon"
        onClick={toggleCreateMessage}
      ></i>
      {showCreateMessage && (
        <div className="create-new-message-modal">
          <div className="new-message-header">
            <div></div>
            <h2>New Message</h2>
            <div>
              <i
                className="fa-solid fa-xmark x-mark-icon"
                onClick={handleKeyDown}
              ></i>
            </div>
          </div>
          <div className="search-box">
            <span>To: </span>
            <input type="text" placeholder="Search..." />
          </div>
          <button className="start-chat-button">Chat</button>
        </div>
      )}
    </>
  );
};

export default CreateMessage;
