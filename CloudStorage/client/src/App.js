// import logo from './logo.svg';
// import './styles/App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
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
          {/* <Route path="/" element={<Menu></Menu>} />
          <Route path="/profile" element={<Profile></Profile>} />
          <Route path="/game" element={<Game></Game>} /> */}
          <Route path="/" element={<Main></Main>} />
          <Route path="*" element={<Error404></Error404>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;