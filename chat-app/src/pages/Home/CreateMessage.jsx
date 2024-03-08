import React from 'react';
import { useState, useEffect } from 'react';

const CreateMessage = () => {
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const toggleCreateMessage = () => {
    setShowCreateMessage((prevState) => !prevState);
  };

  const handleKeyDown = (event) => {
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
        <div
          className="page-overlay"
          onClick={() => setShowCreateMessage(false)}
        >
          <div
            className="create-new-message-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="new-message-header">
              <div></div>
              <h2 className="new-message-text">New Message</h2>
              <div>
                <i
                  className="fa-solid fa-xmark x-mark-icon"
                  onClick={() => setShowCreateMessage(false)}
                ></i>
              </div>
            </div>

            <div className="search-box">
              <span>To: </span>
              <input type="text" placeholder="Search..." />
            </div>
            <button className="start-chat-button">Chat</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMessage;
