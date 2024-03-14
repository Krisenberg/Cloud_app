import './App.css';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'react-bootstrap';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import WaitingRoom from './components/WaitingRoom';
import {useState} from 'react'
import Game from './components/Game';
import Cookies from "universal-cookie"

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
  const cookies = new Cookies();

  const joinGame = async(username) => {
    try {
      const conn = new HubConnectionBuilder()
                    .withUrl("http://localhost:5244/game")
                    .configureLogging(LogLevel.Information)
                    .build();
      conn.on("JoinGame", (hasGameStarted, msg) => {
        console.log("has game started: ", hasGameStarted, "msg: ", msg);
        setGameStatus(hasGameStarted);
        setUserJoinStatus(true);
        if (!hasGameStarted){
          setPlayerMark("X");
        }
      });

      // conn.on("JoinGame", (msg) => {
      //   console.log("msg: ", msg);
      // });

      await conn.start();
      await conn.invoke("JoinGame", username);
      cookies.set("username", username);

      setConnection(conn);
    } catch(e) {
      console.log(e);
    }
  }

  const handleGameJoining = () => {
    if (!hasUserJoinedGame)
      return <WaitingRoom joinGame={joinGame}></WaitingRoom>;
    if (!hasGameStarted)
      return <h1 className='font-weight'>Waiting for the opponent...</h1>;
    var username = cookies.get("username");
    return <Game playerMark={playerMark} conn={conn} username={username}></Game>
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
