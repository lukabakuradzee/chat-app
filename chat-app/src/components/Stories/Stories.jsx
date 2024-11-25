import React, { useState, useEffect } from 'react';
import { getActiveStories } from '../../api/services/userServices';
import styles from '../Stories/Stories.module.scss';

function Stories() {
  const [activeStories, setActiveStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getActiveStories();
        console.log('Stories data: ', data);
        setActiveStories(data);
      } catch (error) {
        console.error('Error fetching stories', error);
      }
    };
    fetchStories();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeStories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeStories.length - 1 : prevIndex - 1
    );
  };

  if (!activeStories || activeStories.length === 0) {
    return <div>Loading stories...</div>;
  }

  return (
    <div className={styles.storiesContainer}>
      <div className={styles.story}>
        <img
          src={activeStories[currentIndex].media}
          alt={activeStories[currentIndex].title}
          className={styles.storyImage}
        />
        <p className={styles.storyTitle}>{activeStories[currentIndex].title}</p>
      </div>
      <div className={styles.navigation}>
        <button onClick={handlePrevious} className={styles.navButton}>
          &#8249;
        </button>
        <button onClick={handleNext} className={styles.navButton}>
          &#8250;
        </button>
      </div>
    </div>
  );
}

export default Stories;
