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
  console.log('User: ', user);

  useEffect(() => {
    if(!user) {
      return;
    }
    console.log('Attempting to the socket');
    const newSocket = io('http://localhost:5500', {
      query: {
        username: user.username,
      },
    });
    setSocket(newSocket);

    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 500);

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
