import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider } from './context/auth/AuthContextProvider';
import { LoadingProvider } from './context/Loading/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <LoadingProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </LoadingProvider>
  </Router>,
);
