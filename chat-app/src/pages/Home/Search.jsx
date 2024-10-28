import React, { useState, useEffect } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { personInfo } from '../../api/users';
import useFetchPersonInfo from '../../Hooks/useFetchPersonInfo';

const Search = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  const { personInfoData, error } = useFetchPersonInfo();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [storedSearchResults, setStoredSearchResults] = useState([]);

  useEscapeKeyHandler(() => {
    setToggleSearch(false);
    if (!searchPerformed) {
      setSearchResults(storedSearchResults); // Restore stored search results
    }
  });

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.trim() === '') {
      setSearchResults([]);
      return;
    }

    const searchTerm = input.toLowerCase();
    const filteredPersons = personInfoData.filter((person) =>
      person.name.toLowerCase().includes(searchTerm),
    );
    setSearchResults(filteredPersons);
    setSearchPerformed(true);
  };

  const toggleClickSearch = () => {
    setToggleSearch((prevState) => {
      if (!prevState && !searchPerformed) {
        setSearchResults([]); // Clear search results when closing modal if search was not performed
      } else if (prevState) {
        setStoredSearchResults(searchResults);
      }
      return !prevState;
    });
  };

  return (
    <>
      {error && <h1>{error}</h1>}
      <i
        className="fa-solid fa-magnifying-glass search-messages-icon"
        onClick={toggleClickSearch}
        title="Search"
      ></i>
      <div className={`search-modal-content ${toggleSearch ? 'show' : ''}`}>
        <div className="search-header">
          <h2 className="search-header-text">Search</h2>
          <div className="search-box-modal">
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
      </div>
      <div className="search-results">
        {toggleSearch &&
          searchResults.map((person) => (
            <div key={person.id} className="person-result">
              <div className="person-img-container">
                <img src={person.avatar} alt="" />
              </div>
              <h3>
                <span>{person.name}</span> <span>{person.lastName}</span>
              </h3>
            </div>
          ))}
      </div>
    </>
  );
};

export default Search;
