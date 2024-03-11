import './App.scss';
import AppRoutes from './Routes';
import './reset.css';
import { useState, useEffect } from 'react';
import PageLoading from './components/PageLoading/PageLoading';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <>
      <div className={`App ${isLoading ? 'loading' : ''}`}>
        {isLoading && <PageLoading />}
        {!isLoading && <AppRoutes />}
      </div>
    </>
  );
}

export default App;
