import React from 'react';
import { useState, useEffect } from 'react';
import useEscapeKeyHandler from '../../Hooks/EscapeHandler';
import { personInfo } from '../../api/users';
import { RingLoader } from 'react-spinners';

const Search = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personInfoData, setPersonInfoData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const person = await personInfo();
        setPersonInfoData(person);
      } catch (error) {
        setError('Error fetching person data' + error.msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleClickSearch = () => {
    setToggleSearch((prevState) => !prevState);
  };

  useEscapeKeyHandler(() => {
    setToggleSearch(false);
  });

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.includes('@')) {
      const searchTerm = input.slice(input.indexOf('@') + 1).toLowerCase();
      const filteredPersons = personInfoData.filter((person) =>
        person.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filteredPersons);
      console.log(filteredPersons)
    } else {
      setSearchResults([]);
    }
  };


    return (
      <>
        {error && <h1>{error}</h1>}
        {loading && (
          <div className="bar-loader" style={{}}>
            <RingLoader color="#fe3c72" />
          </div>
        )}
        <i
          className="fa-solid fa-magnifying-glass search-messages-icon"
          onClick={toggleClickSearch}
          title="Search"
        ></i>
        <div className={`search-modal-content ${toggleSearch ? 'show' : ''}`}>
          <div className="search-header">
            <h2 className="search-header-text">Search</h2>
            <div className="search-box-modal">
              <input type="text" placeholder="Search" onChange={handleSearchInputChange}/>
            </div>
          </div>
        </div>
        <div className="search-results">
          {searchResults.map((person) => (
            <div key={person.id} className="person-result">
               <div className='person-img-container'><img src={person.image} alt="" /></div>
              <h3>{person.name}</h3>
            </div>
          ))}
        </div>
      </>
    );
  };

export default Search;
