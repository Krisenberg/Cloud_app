import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Error404 from './pages/Error404';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>} />
          <Route path="*" element={<Error404></Error404>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;