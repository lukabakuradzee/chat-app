import React, { useState, useEffect } from 'react';
import { personInfo } from '../../api/users';
import { RingLoader } from 'react-spinners';

function Feed() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personInfoData, setPersonInfoData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const person = await personInfo();
        setPersonInfoData(person);
      } catch (error) {
        setError('Error fetching Person Data' + error.msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="user-feed-container">
      <h1>People You May Know</h1>
      {error && <h1>{error}</h1>}
      {loading && (
        <div className="bar-loader" style={{}}>
          <RingLoader color="#fe3c72" />
        </div>
      )}
      <div className="person-info-api">
        {personInfoData.map((person) => (
          <div key={person.id} className="person-info-box">
            <div className="person-image-container">
              <img src={person.image} alt="" />
            </div>
            <h2>
              <span>Name: </span> {person.name}
            </h2>
            <p>
              <span>Email: </span> {person.email}
            </p>
            <p>
              <span>Age: </span>
              {person.age}
            </p>
            <p>
              <span>State: </span> {person.address.state}
            </p>
            <p>
              <span>Address: </span> {person.address.city}
            </p>
            <p>
              <span>Street:</span> {person.address.street}
            </p>
            <p>
              <span>Interests: </span> {person.interests.join(', ')}
            </p>
            <p><span>Followers: </span>{person.followersCount}, <span>Following: </span>{person.followingCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
