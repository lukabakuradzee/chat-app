import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import EmojiPicker from 'emoji-picker-react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

const Chat = ({ chatMessages }) => {
  const chatContainerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { state } = useAuthContext();
  const { user } = state;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleMessageChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputMessage.trim() === '') {
      return; // Prevent sending empty messages
    }
    // Add the message to the list of messages
    setMessages([
      ...messages,
      { text: inputMessage, sender: user.username },
    ]);
    // Clear the input field
    setInputMessage('');
  };

  const handleFormSubmit = (event) => {
    if (event) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  useEffect(() => {
    // Scroll chat container to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  useEscapeKeyHandler(() => {
    setShowEmojiPicker(false);
  });

  const handleEmojiClick = (emoji) => {
    setInputMessage(inputMessage + emoji);
  };

  return (
    <div className="chat-container">
      <div className="emoji-picker-container">
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
            disableAutoFocus={true}
            style={{
              height: '400px',
              backgroundColor: '#fe3c72',
              borderStyle: 'none',
            }}
          />
        )}
      </div>
      <div ref={chatContainerRef} className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === user.username ? 'current-user' : 'other-user'}`}
          >
            <span className="sender">{user.username}</span>:{' '}
            <span className="message-text-chat">{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleMessageChange}
        />

        <i
          class="fa-solid fa-face-smile emoji-icon-click"
          onClick={toggleEmojiPicker}
        ></i>

        <button type="submit" className="send-message-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
