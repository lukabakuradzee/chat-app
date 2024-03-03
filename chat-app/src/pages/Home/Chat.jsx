import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { state } = useAuthContext();
  const { user } = state;

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() === '') {
      return; // Prevent sending empty messages
    }
    // Add the message to the list of messages
    setMessages([...messages, { text: message, sender: 'user' }]);
    // Clear the input field
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
           <span className="sender">{user.userName}</span>: <span className="message-text-chat">{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
        />
        <button type="submit" className="send-message-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
