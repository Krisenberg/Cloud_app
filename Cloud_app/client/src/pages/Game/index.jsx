import classes from './Game.module.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Col, Row, Navbar, Container, Nav } from 'react-bootstrap';
import '../../styles/App.css'
import useScrollBlock from '../../utils/useScrollBlock';
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { HubConnectionBuilder, LogLevel, DefaultHttpClient } from '@microsoft/signalr'
import WaitingRoom from '../../components/WaitingRoom'
import GameData from '../../components/GameData'
import GameResult from '../../components/GameResult'
import PreventUnload from '../../utils/PreventUnload';
import { fetchAuthSession } from '@aws-amplify/auth';
import getAccessToken from '../../utils/AuthTokens';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Game = () => {

    const [blockScroll, allowScroll] = useScrollBlock();
    const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
    // const { user, signOut } = useAuthenticator((context) => [context.user]);
    const isLoggedIn = (authStatus === 'authenticated');
    const[conn, setConnection] = useState();
    const[hasUserJoinedGame, setUserJoinStatus] = useState(false);
    const[hasGameStarted, setGameStatus] = useState(false);
    const[playerMark, setPlayerMark] = useState("O");
    const[playerUsername, setPlayerUsername] = useState(null);
    const[opponentUsername, setOpponentUsername] = useState(null);
    const[isGameFinished, markGameFinished] = useState(false);
    const[gameWinner, setGameWinner] = useState(null);
    // const[bearerToken, setBearerToken] = useState(null);
    const cookies = new Cookies();

    const printAccessTokenAndIdToken = async () => {
        try {
            const session = await fetchAuthSession();   // Fetch the authentication session
            console.log('Access Token:', session.tokens.accessToken.toString());
            console.log('ID Token:', session.tokens.idToken.toString());
        }
        catch (e) { console.log(e); }
    };

    const createRequestAuthHeader = async () => {
        try {
            const accessToken = await getAccessToken();
            const header = `Bearer ${accessToken}`
            // setBearerToken(`Bearer ${accessToken}`);
            console.log(`Fetched auth token: ${header}`);
            return header;
            // console.log(accessToken.payload.auth_time);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    class CustomHttpClient extends DefaultHttpClient {
        async send(request) {
            const header = await createRequestAuthHeader();
            request.headers = { ...request.headers, "Authorization": header };
            return super.send(request);
        }
    }

    // blockScroll();

    const joinGame = async(username) => {
        try {
            // const header = await createRequestAuthHeader();
            // console.log(header);
            // const headers = { 'Authorization': header };
            // console.log(headers);
            // if (header !== null) {
            //     console.log(header);
            //     const headers = { 'Authorization': header };
            //     console.log(headers);
            // }
            const conn = new HubConnectionBuilder()
                .withUrl(`${process.env.REACT_APP_BACKEND_IP}/game`, { httpClient: new CustomHttpClient() })
                .configureLogging(LogLevel.Information)
                .build();
            // console.log(bearerToken);
            // const headers = { 'Authorization': bearerToken };
            // console.log(headers);
            // const conn = new HubConnectionBuilder()
            //             .withUrl(`${process.env.REACT_APP_BACKEND_IP}/game`, headers)
            //             .configureLogging(LogLevel.Information)
            //             .build();
            setConnection(conn);
            conn.on("JoinGame", (hasGameStarted, username1, username2, msg) => {
                console.log("Has game started: ", hasGameStarted, "msg: ", msg);
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
            return <WaitingRoom isLoggedIn={isLoggedIn} joinGame={joinGame}></WaitingRoom>;
        // var username = cookies.get("username");
        if (!hasGameStarted){
            return (
                <div className={`${classes.contentContainer}`}>
                    <PreventUnload></PreventUnload>
                    <Col sm={12} className={`${classes.contentColumn}`}>
                        <h2 className={`${classes.waitingHeader}`}><span className={`${classes.userDataColor}`}>{playerUsername} [{user.username}]</span>, you are the first one in the queue.</h2>
                        <div className={`${classes.line}`}/>
                        <h2 className={`${classes.detailsText}`}>please wait for the opponent...</h2>
                    </Col>
                </div>
            )
        }
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
        return (<GameData playerMark={playerMark} conn={conn} username={playerUsername} opponentUsername={opponentUsername}></GameData>)
    }

    return (
        <Container>
            <Navbar className="navbar">
                <Container>
                    <Navbar.Brand className="navbar-brand" href="/">
                        <img
                            alt=""
                            src="logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        <span className="roboto-navbar">
                            TIC TAC TOE
                        </span>
                    </Navbar.Brand>
                    <Nav className="navbar-links">
                        {isLoggedIn ? 
                            <Nav.Link className="roboto-navbar underline-link" href="/profile">PROFILE</Nav.Link>
                            :
                            <Nav.Link className="roboto-navbar underline-link" href="/profile">LOGIN</Nav.Link>
                        }
                        {/* <Nav.Link className="roboto-navbar underline-link" href="/profile">PROFILE</Nav.Link>    */}
                    </Nav>
                </Container>
            </Navbar>
            <Col sm={12} className={`${classes.mainColumn}`}>
                {isLoggedIn ? null :
                    <div className={`${classes.notSignedColumn}`}>
                        <Alert severity="error" style={{width: "wrap-content !important"}}>
                            <AlertTitle>Not signed in</AlertTitle>
                            You can play only after authorization (Amazon AWS identity provider).
                        </Alert>
                        {/* <p className={`roboto-light ${classes.notSignedText}`}>You have to log in to play the game!</p> */}
                        <div className={`${classes.line}`}/>
                    </div>
                }
                { handleGameJoining() }
                
            </Col>
        </Container>
    );
}

export default Game;