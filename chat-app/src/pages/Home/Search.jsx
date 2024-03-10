import React from 'react';
import { useState } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';

const Search = () => {
  const [toggleSearch, setToggleSearch] = useState(false);

  const toggleClickSearch = () => {
    setToggleSearch((prevState) => !prevState);
  };

  useEscapeKeyHandler(() => {
    setToggleSearch(false);
  });

  return (
    <>
      <i
        className="fa-solid fa-magnifying-glass search-messages-icon"
        onClick={toggleClickSearch}
        title="Search"
      ></i>
      <div className={`search-modal-content ${toggleSearch ? 'show' : ''}`}>
        <div className="search-header">
          <h2 className="search-header-text">Search</h2>
          <div className="search-box-modal">
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
