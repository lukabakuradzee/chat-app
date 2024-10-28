import { useState, useEffect } from 'react';
import { personInfo } from '../api/users';

function useFetchPersonInfo() {
  const [personInfoData, setPersonInfoData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const person = await personInfo();
        setPersonInfoData(person);
      } catch (error) {
        setError('Error fetching person info', error);
      }
    };
    fetchData();
  }, []);

  return { personInfoData, error };
}

export default useFetchPersonInfo;
