import './App.css';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'react-bootstrap';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import WaitingRoom from './components/WaitingRoom';
import {useState} from 'react'
import Game from './components/Game';
import GameResult from './components/GameResult';
import Cookies from "universal-cookie";

function App() {
  // return (
  //   <div className="App">
  //     <SignUp></SignUp>
  //     <Login></Login>
  //   </div>
  // );
  const[conn, setConnection] = useState();
  const[hasUserJoinedGame, setUserJoinStatus] = useState(false);
  const[hasGameStarted, setGameStatus] = useState(false);
  const[playerMark, setPlayerMark] = useState("O");
  const[playerUsername, setPlayerUsername] = useState(null);
  const[opponentUsername, setOpponentUsername] = useState(null);
  const[isGameFinished, markGameFinished] = useState(false);
  const[gameWinner, setGameWinner] = useState(null);
  const cookies = new Cookies();

  const joinGame = async(username) => {
    try {
      const conn = new HubConnectionBuilder()
                    .withUrl("http://localhost:5244/game")
                    .configureLogging(LogLevel.Information)
                    .build();
      setConnection(conn);
      conn.on("JoinGame", (hasGameStarted, username1, username2, msg) => {
        console.log("has game started: ", hasGameStarted, "msg: ", msg);
        setGameStatus(hasGameStarted);
        if (username === username1){
          setPlayerUsername(username1)
          setOpponentUsername(username2)
        }
        if (username2 != null && username2 === username){
          setPlayerUsername(username2);
          setOpponentUsername(username1)
        }
        setUserJoinStatus(true);
        if (!hasGameStarted){
          setPlayerMark("X");
        }
      });

      conn.on("FinishGame", (winner) => {
        console.log("The game has finished. Winner: ", winner);
        markGameFinished(true);
        setGameWinner(winner);
      });

      // conn.on("JoinGame", (msg) => {
      //   console.log("msg: ", msg);
      // });

      await conn.start();
      await conn.invoke("JoinGame", username);
      setPlayerUsername(username);
      cookies.set("username", username);
    } catch(e) {
      console.log(e);
    }
  }

  const handleGameJoining = () => {
    if (!hasUserJoinedGame)
      return <WaitingRoom joinGame={joinGame}></WaitingRoom>;
    // var username = cookies.get("username");
    if (!hasGameStarted)
      return (
        <Row className='px-5 py-5'>
            <Col sm={12}>
              <hr></hr>
              <h2>Hi {playerUsername},</h2>
              <h2>please wait for the opponent...</h2>
            </Col>
        </Row>
      )
    if (isGameFinished) {
      if (gameWinner === null){
        return <GameResult hasUserWon={false} isDraw={true}></GameResult>
      }
      if (gameWinner === playerUsername){
        return <GameResult hasUserWon={true}  isDraw={false}></GameResult>
      }
      return <GameResult hasUserWon={false}  isDraw={false}></GameResult>
    }
      // return <h1 className='font-weight'>Waiting for the opponent...</h1>;
    return <Game playerMark={playerMark} conn={conn} username={playerUsername} opponentUsername={opponentUsername}></Game>
  }


  return (
    <div className='App'>
      <main>
        <Container>
          <Row class='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight'>Welcome to the TIC TAC TOE game!</h1>
            </Col>
          </Row>
          { handleGameJoining() }
          {/* {!hasUserJoinedGame
            ? <WaitingRoom joinGame={joinGame}></WaitingRoom>
            : <h1 className='font-weight'>User has joined the game.</h1>
          } */}
          {/* {!hasGameStarted
            ? <h1 className='font-weight'>User is waiting for the opponent...</h1>
            : <h1 className='font-weight'>all is set and ready to play</h1>
          } */}
          
          {/* {!conn
            ? <WaitingRoom joinGame={joinGame}></WaitingRoom>
            : ...
          } */}
        </Container>
      </main>
    </div>
  );
}

export default App;
