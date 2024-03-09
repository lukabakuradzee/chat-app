import { BarLoader } from 'react-spinners';
import './App.scss';
import AppRoutes from './Routes';
import './reset.css';
import { useState, useEffect } from 'react';

const Overlay = () => {
  return (
    <div className="overlay">
      <div className='app-logo-box'>
        <i className="fa-brands fa-microblog app-logo-overlay"></i>
      </div>
      <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" loading={true}/>
        </div>
    </div>
  );
};

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
      <div className="App">
        {isLoading && <Overlay />}
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
