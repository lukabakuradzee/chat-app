import './App.scss';
import AppRoutes from './Routes';
import io from 'socket.io-client';
import './reset.css';
import { useState, useEffect } from 'react';
import PageLoading from './components/PageLoading/PageLoading';
import { useAuthContext } from './context/auth/AuthContextProvider';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { state } = useAuthContext();
  const { user } = state;

  useEffect(() => {
    if(!user) {
      setIsLoading(false)
      return;
    }
    console.log('Attempting to the socket');
    const newSocket = io('http://localhost:5500');
    setSocket(newSocket);

    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      newSocket.disconnect();
      clearTimeout(timeOut);
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('test', (message) => {
        console.log('Test event received', message);
      });
    }
  }, [socket]);

  return (
    <>
      <div className={`App ${isLoading ? 'loading' : ''}`}>
        {isLoading && <PageLoading />}
        {!isLoading && <AppRoutes socket={socket} />}
      </div>
    </>
  );
}

export default App;
