import React from 'react';
import { useState, useEffect } from 'react';
import { fetchData } from './fetchData';
import { RingLoader } from 'react-spinners';

const Data = () => {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const movies = await fetchData();
        setMovieData(movies);
      } catch (error) {
        setError('Error fetching movies' + error.msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndSetState();
  }, []);

  return (
    <div className="movie-list">
      {error && <h1>{error}</h1>}
      {loading && (
        <div className="bar-loader" style={{}}>
           <RingLoader color="#fe3c72" />
        </div>
      )}
      {movieData.map((movie) => (
        <div key={movie.id}>
          <h2>{movie.title}</h2>
          <p>Release Year: {movie.releaseYear}</p>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default Data;
