import React from 'react';
import ReactDOM from 'react-dom/client';
// import setupLogRocketReact from 'logrocket-react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider } from './context/auth/AuthContextProvider';
import { LoadingProvider } from './context/Loading/LoadingContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import LogRocket from 'logrocket';
// LogRocket.init('s3ciy1/chat-app');
// setupLogRocketReact(LogRocket);

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <LoadingProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </GoogleOAuthProvider>
    </LoadingProvider>
  </Router>,
);
