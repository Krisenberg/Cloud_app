// import 'bootstrap/dist/css/bootstrap.min.css';
// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
// import WaitingRoom from './WaitingRoom';
// import {useState} from 'react'
// import WaitingForOpponent from './WaitingForOpponent';
// import GameResult from './GameResult';
// import Cookies from "universal-cookie";

// function GameJoin() {

//     const[conn, setConnection] = useState();
//     const[hasUserJoinedGame, setUserJoinStatus] = useState(false);
//     const[hasGameStarted, setGameStatus] = useState(false);
//     const[playerMark, setPlayerMark] = useState("O");
//     const[playerUsername, setPlayerUsername] = useState(null);
//     const[opponentUsername, setOpponentUsername] = useState(null);
//     const[isGameFinished, markGameFinished] = useState(false);
//     const[gameWinner, setGameWinner] = useState(null);
//     const[isLoggedIn, setIsLoggedIn] = useState(false);
//     const[showLogin, setShowLogin] = useState(false);
//     const cookies = new Cookies();



//     const joinGame = async(username) => {
//         try {
//             const conn = new HubConnectionBuilder()
//                         .withUrl(`${process.env.REACT_APP_BACKEND_IP}/game`)
//                         .configureLogging(LogLevel.Information)
//                         .build();
//             setConnection(conn);
//             conn.on("JoinGame", (hasGameStarted, username1, username2, msg) => {
//             console.log("Has game started: ", hasGameStarted, "msg: ", msg);
//             setGameStatus(hasGameStarted);
//             if (username === username1){
//                 setPlayerUsername(username1)
//                 setOpponentUsername(username2)
//             }
//             if (username2 != null && username2 === username){
//                 setPlayerUsername(username2);
//                 setOpponentUsername(username1)
//             }
//             setUserJoinStatus(true);
//             if (!hasGameStarted){
//                 setPlayerMark("X");
//             }
//             });

//             conn.on("FinishGame", (winner) => {
//             console.log("The game has finished. Winner: ", winner);
//             markGameFinished(true);
//             setGameWinner(winner);
//             });

//             // conn.on("JoinGame", (msg) => {
//             //   console.log("msg: ", msg);
//             // });

//             await conn.start();
//             await conn.invoke("JoinGame", username);
//             setPlayerUsername(username);
//             cookies.set("username", username);
//         } catch(e) {
//             console.log(e);
//         }
//     }

//     if (!hasUserJoinedGame)
//         return <WaitingRoom isLoggedIn={isLoggedIn} joinGame={joinGame}></WaitingRoom>;
//     // var username = cookies.get("username");
//     if (!hasGameStarted)
//         return (
//         <Row className='px-5 py-5'>
//             <Col sm={12}>
//                 <hr></hr>
//                 <h2>Hi {playerUsername},</h2>
//                 <h2>please wait for the opponent...</h2>
//             </Col>
//         </Row>
//         )
//     if (isGameFinished) {
//         if (gameWinner === null){
//         return <GameResult hasUserWon={false} isDraw={true}></GameResult>
//         }
//         if (gameWinner === playerUsername){
//         return <GameResult hasUserWon={true}  isDraw={false}></GameResult>
//         }
//         return <GameResult hasUserWon={false}  isDraw={false}></GameResult>
//     }
//         // return <h1 className='font-weight'>Waiting for the opponent...</h1>;
//     return <WaitingForOpponent playerMark={playerMark} conn={conn} username={playerUsername} opponentUsername={opponentUsername}></WaitingForOpponent>
// }


// export default GameJoin;