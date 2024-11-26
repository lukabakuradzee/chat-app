import React, { useState, useEffect } from 'react';
import { personInfo } from '../../api/users';
import { RingLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import styles from '../People/People.module.scss';

function People() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personInfoData, setPersonInfoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const person = await personInfo();
        console.log('API Response Person: ', person);
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
    <section className={styles.userFeedContainer}>
      <h1>People You May Know</h1>
      {error && <h1>{error}</h1>}
      {loading && (
        <div className="bar-loader" style={{}}>
          <RingLoader color="#fe3c72" />
        </div>
      )}

      <div className={styles.personInfoGrid}>
        {personInfoData.map((person) => (
          <div key={person._id} className={styles.personInfoBox}>
            <div className={styles.personImageContainer}>
              <Link to={`/profile/${person.username}`}>
                <img src={person.avatar} alt="" />
              </Link>
            </div>
            <p>{person.username}</p>
            <h2>
              <span>Name: </span> {person.name}
            </h2>
            <p>
              <span>Last Name: </span> {person.lastName}
            </p>
            <p>
              <span>Age: </span>
              {person.age}
            </p>
            <p>
              <span>Email: </span> {person.email}
            </p>
          </div>
        ))}
        {/* <SignIn/> */}
      </div>
    </section>
  );
}

export default People;
