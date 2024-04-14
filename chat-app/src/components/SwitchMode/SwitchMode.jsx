import React from 'react';
import { useState } from 'react';

const SwitchMode = ({ onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  document.body.className = isDarkMode ? 'light-mode' : '';

  return (
    <div className="switch-appereance-container">
      <div className="swp-child" onClick={onClose}>
        <i className="fa-solid fa-chevron-left"></i>
        <span>Switch appereance</span>
        <i className="fa-regular fa-moon" title="Theme icon"></i>
      </div>
      <div className="swp-child-change-mode">
        <span>Dark Mode</span>
        <label className="switch">
          <input
            type="checkbox"
            aria-checked="true"
            role="switch"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default SwitchMode;
