import './styles/App.css';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Col, Row, Container, Button } from 'react-bootstrap';
// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
// import WaitingRoom from './components/WaitingRoom';
// import {useState} from 'react'
// import WaitingForOpponent from './components/WaitingForOpponent';
// import GameResult from './components/GameResult';
// import Cookies from "universal-cookie";

import React from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import Login from './components/Login';

import { Routes, Route, Link } from 'react-router-dom';
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

// Amplify.configure({
//   Auth: {
//       region: 'us-east-1',
//       userPoolId: 'us-east-1_bpRvmg5L3',
//       userPoolWebClientId: '2bcbv3ncfdn73dg1lj5r9rpbsg', 
//   }
// });

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

// function App() {
  // const[conn, setConnection] = useState();
  // const[hasUserJoinedGame, setUserJoinStatus] = useState(false);
  // const[hasGameStarted, setGameStatus] = useState(false);
  // const[playerMark, setPlayerMark] = useState("O");
  // const[playerUsername, setPlayerUsername] = useState(null);
  // const[opponentUsername, setOpponentUsername] = useState(null);
  // const[isGameFinished, markGameFinished] = useState(false);
  // const[gameWinner, setGameWinner] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [showLogin, setShowLogin] = useState(false);
  // const cookies = new Cookies();

  // const joinGame = async(username) => {
  //   try {
  //     const conn = new HubConnectionBuilder()
  //                   .withUrl(`${process.env.REACT_APP_BACKEND_IP}/game`)
  //                   .configureLogging(LogLevel.Information)
  //                   .build();
  //     setConnection(conn);
  //     conn.on("JoinGame", (hasGameStarted, username1, username2, msg) => {
  //       console.log("Has game started: ", hasGameStarted, "msg: ", msg);
  //       setGameStatus(hasGameStarted);
  //       if (username === username1){
  //         setPlayerUsername(username1)
  //         setOpponentUsername(username2)
  //       }
  //       if (username2 != null && username2 === username){
  //         setPlayerUsername(username2);
  //         setOpponentUsername(username1)
  //       }
  //       setUserJoinStatus(true);
  //       if (!hasGameStarted){
  //         setPlayerMark("X");
  //       }
  //     });

  //     conn.on("FinishGame", (winner) => {
  //       console.log("The game has finished. Winner: ", winner);
  //       markGameFinished(true);
  //       setGameWinner(winner);
  //     });

  //     // conn.on("JoinGame", (msg) => {
  //     //   console.log("msg: ", msg);
  //     // });

  //     await conn.start();
  //     await conn.invoke("JoinGame", username);
  //     setPlayerUsername(username);
  //     cookies.set("username", username);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  // const handleGameJoining = () => {
  //   if (!hasUserJoinedGame)
  //     return <WaitingRoom isLoggedIn={isLoggedIn} joinGame={joinGame}></WaitingRoom>;
  //   // var username = cookies.get("username");
  //   if (!hasGameStarted)
  //     return (
  //       <Row className='px-5 py-5'>
  //           <Col sm={12}>
  //             <hr></hr>
  //             <h2>Hi {playerUsername},</h2>
  //             <h2>please wait for the opponent...</h2>
  //           </Col>
  //       </Row>
  //     )
  //   if (isGameFinished) {
  //     if (gameWinner === null){
  //       return <GameResult hasUserWon={false} isDraw={true}></GameResult>
  //     }
  //     if (gameWinner === playerUsername){
  //       return <GameResult hasUserWon={true}  isDraw={false}></GameResult>
  //     }
  //     return <GameResult hasUserWon={false}  isDraw={false}></GameResult>
  //   }
  //     // return <h1 className='font-weight'>Waiting for the opponent...</h1>;
  //   return <WaitingForOpponent playerMark={playerMark} conn={conn} username={playerUsername} opponentUsername={opponentUsername}></WaitingForOpponent>
  // }

  // const handleLoginClick = () => {
  //   setShowLogin(true);
  // };


  // const handleLoginClick = () => {
  //   return <Login setIsLoggedIn={ setIsLoggedIn }></Login>
  // }

  // return ( <Menu></Menu> );
  // return (
  //   <div className='App'>
  //     <header>
  //         <Container>
  //             <Row className='py-3'>
  //                 <Col sm={12} className='d-flex justify-content-end'>
  //                     <Button onClick= { handleLoginClick } variant='primary'>Login</Button>
  //                 </Col>
  //             </Row>
  //         </Container>
  //     </header>
  //     <main>
  //       <Container>
  //         <Row class='px-5 my-5'>
  //           <Col sm='12'>
  //             <h1 className='font-weight'>Welcome to the TIC TAC TOE game!</h1>
  //           </Col>
  //         </Row>
  //         {showLogin && <Login setIsLoggedIn={ setIsLoggedIn }></Login>}
  //         {!showLogin &&  handleGameJoining() }
          // {/* {!hasUserJoinedGame
          //   ? <WaitingRoom joinGame={joinGame}></WaitingRoom>
          //   : <h1 className='font-weight'>User has joined the game.</h1>
          // } */}
          // {/* {!hasGameStarted
          //   ? <h1 className='font-weight'>User is waiting for the opponent...</h1>
          //   : <h1 className='font-weight'>all is set and ready to play</h1>
          // } */}
          
          // {/* {!conn
          //   ? <WaitingRoom joinGame={joinGame}></WaitingRoom>
          //   : ...
          // } */}
  //         {/* <Authenticator>
  //           {({ signOut, user }) => (
  //             <main>
  //               <h1>Hello {user.username}</h1>
  //               <button onClick={signOut}>Sign out</button>
  //               <button onClick={printAccessTokenAndIdToken}>Print Tokens</button>
  //             </main>
  //           )}
  //         </Authenticator> */}
  //       </Container>
  //     </main>
  //   </div>
  // );
// }

export default App;
