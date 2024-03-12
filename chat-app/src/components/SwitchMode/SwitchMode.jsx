import React from 'react';

const SwitchMode = () => {
  return (
    <div className="switch-appereance-container">
      <div className="swp-child">
        <i class="fa-solid fa-chevron-left"></i>
        <span>Switch appereance</span>
        <i class="fa-regular fa-moon" title="Theme icon"></i>
      </div>
      <div className="swp-child-change-mode">
        <span>Dark Mode</span>
        <label className="switch">
          <input
            type="checkbox"
            aria-checked="true"
            role="switch"
            // checked={isDarkMode}
            // onChange={toggleDarkMode}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default SwitchMode;
