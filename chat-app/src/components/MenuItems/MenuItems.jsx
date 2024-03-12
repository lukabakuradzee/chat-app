import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ icon, text, onClick }) => {
  return (
    <div className="menu-item" onClick={onClick}>
      <i className={`fa ${icon}`}></i>
      <span>{text}</span>
    </div>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MenuItem;
