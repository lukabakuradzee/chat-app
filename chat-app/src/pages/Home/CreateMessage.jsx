import React, { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

const CreateMessage = () => {
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const toggleCreateMessage = () => setShowCreateMessage(prevState => !prevState);

  useEscapeKeyHandler(() => setShowCreateMessage(false));

  return (
    <>
      <i
        className="fa-solid fa-pen-to-square user-info-edit-icon"
        onClick={toggleCreateMessage}
      />
      {showCreateMessage && (
        <div className="page-overlay" onClick={() => setShowCreateMessage(false)}>
          <div className="create-new-message-modal" onClick={e => e.stopPropagation()}>
            <div className="new-message-header">
              <h2 className="new-message-text">New Message</h2>
              <i className="fa-solid fa-xmark x-mark-icon" onClick={() => setShowCreateMessage(false)} />
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
