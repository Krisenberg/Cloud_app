import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { Routes, Route } from 'react-router-dom';

import Menu from './pages/Menu';
import Profile from './pages/Profile';
import Game from './pages/Game';
import Error_404 from './pages/Error_404';

function App() {
  return (
    <div>
      <Authenticator.Provider>
        <Routes>
          <Route path="/" element={<Menu></Menu>} />
          <Route path="/profile" element={<Profile></Profile>} />
          <Route path="/game" element={<Game></Game>} />
          <Route path="*" element={<Error_404></Error_404>} />
        </Routes>
      </Authenticator.Provider>
    </div>
  );
}

Amplify.configure({
  Auth: {
    Cognito: {
      region: `${process.env.REACT_APP_COGNITO_REGION}`,
      userPoolClientId: `${process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID}`,
      userPoolId: `${process.env.REACT_APP_COGNITO_USER_POOL_ID}`,
      // loginWith: { // Optional
      //   oauth: {
      //     domain: 'abcdefghij1234567890-29051e27.auth.us-east-1.amazoncognito.com',
      //     scopes: ['openid email phone profile aws.cognito.signin.user.admin '],
      //     redirectSignIn: ['http://localhost:3000/','https://example.com/'],
      //     redirectSignOut: ['http://localhost:3000/','https://example.com/'],
      //     responseType: 'code',
      //   },
      //   username: 'true',
      //   email: 'false', // Optional
      //   phone: 'false', // Optional
      // }
    }
  }
});

export default App;
