// import classes from './Profile.module.css';
// import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
// import { Col, Row, Navbar, Container, Nav } from 'react-bootstrap';
// import '../../styles/App.css'
// import React, { useState, useEffect } from "react";
// import { jwtDecode } from 'jwt-decode';
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import { checkAccessToken } from '../../utils/CheckAuth';
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';


// const Profile = () => {

//     const [accessToken, setAccessToken] = useState(null);
//     const [authTime, setAuthTime] = useState("");
//     const [expTime, setExpTime] = useState("");
//     const { authStatus } = useAuthenticator(context => [context.authStatus]);
//     const [openBackdrop, setOpenBackdrop] = useState(false);

//     const setAuthTimes = () => {
//         console.log('Trying to fetch auth times');
//         setAuthTime(accessToken.auth_time);
//         setExpTime(accessToken.exp);
//         console.log('Done');
//     }

//     useEffect(() => {
//         async function asyncFn () {
//             await fetchAuthTimes();
//             setAuthTimes();
//         };
//         // await fetchAuthTimes();
//         // setAuthTimes();
//         asyncFn();
//     });

//     // useEffect(() => {
//     //     window.location.reload();
//     //     console.log('RELOAD');
//     // }, [reloadOnce]);

//     const fetchAuthTimes = async () => {
//         try {
//             const result = await checkAccessToken();
//             if (result) {
//                 const rawToken = localStorage.getItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`);
//                 const decodedToken = jwtDecode(rawToken);
//                 setAccessToken(decodedToken);
//                 console.log('ACCESS TOKEN ->', rawToken);
//                 // setAuthTimes();
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     }

//     const formatDateFromUnix = (date) => {
//         const options = {
//             hour12: false,
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//         };

//         const formattedDate = new Date(date * 1000).toLocaleString('pl-PL', options);
//         return formattedDate;
//     }

//     const removeTokenFromLocalStorage = () => {
//         localStorage.removeItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`);
//     }

//     return (
//         <Container>
//             <Navbar className="navbar">
//                 <Container>
//                     <Navbar.Brand className="navbar-brand" href="/">
//                         <img
//                             alt=""
//                             src="logo192.png"
//                             width="30"
//                             height="30"
//                             className="d-inline-block align-top"
//                         />{' '}
//                         <span className="roboto-navbar">
//                             TIC TAC TOE
//                         </span>
//                     </Navbar.Brand>
//                     <Nav className="navbar-links">
//                         <Nav.Link className="roboto-navbar underline-link" href="/game">PLAY</Nav.Link>   
//                     </Nav>
//                 </Container>
//             </Navbar>
//             <Col sm={12} className={`${classes.mainColumn}`}>
//                 {authStatus === 'authenticated' ? null :
//                     // accessToken !== null ? null :
//                     <div className={`${classes.notSignedColumn}`}>
//                         <Alert severity="error">
//                             <AlertTitle>Not signed in</AlertTitle>
//                             Please sign in first using Amazon  AWS identity provider.
//                         </Alert>
//                         {/* <p className={`roboto-light ${classes.notSignedText}`}>Please sign in!</p> */}
//                         <div className={`${classes.line}`}/>
//                     </div>
//                 }
//                 <Authenticator>
//                     {({ signOut, user }) => {
//                         // fetchAuthTimes();
//                         // window.location.reload();
//                         // if (!reloadOnce)
//                         //     setReloadOnce(true);
//                         // reloadPageAfterLogin();
//                         // setAuthTimes();
//                         return (
//                             <Col sm={12} className={`${classes.contentColumn}`}>
//                                 <h1 className={`${classes.headerText}`}>YOUR PROFILE</h1>
//                                 <div className={`${classes.line}`}/>
//                                 <Row className={`${classes.detailsRow}`}>
//                                     <Col className={`${classes.detailsColumn}`}>
//                                         <p className={`${classes.detailsText}`}>Username: {user.userId}</p>
//                                         <p className={`${classes.detailsText}`}>Authenticated at: {formatDateFromUnix(authTime)}</p>
//                                         <p className={`${classes.detailsText}`}>Token expires at: {formatDateFromUnix(expTime)}</p>
//                                     </Col>
//                                     <Col className={`${classes.halfColumn}`}>
//                                         <button className={`${classes.leaveButton}`} onClick={ () => { signOut(); removeTokenFromLocalStorage(); window.location.reload(); } }><span className="text">Sign out</span></button>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         );
//                     }}
//                 </Authenticator>
//             </Col>
//         </Container>
//     );
// }

// export default Profile;

import classes from './Profile.module.css';
import { Authenticator, Flex, Divider } from '@aws-amplify/ui-react';
import { Col, Row, Navbar, Container, Nav } from 'react-bootstrap';
import '../../styles/App.css'
import useScrollBlock from '../../utils/useScrollBlock';
import { useState, useEffect } from "react";
import getAccessToken from '../../utils/AuthTokens';
import { jwtDecode } from 'jwt-decode';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { fetchAuthSession } from '@aws-amplify/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthenticator } from '@aws-amplify/ui-react';


const Profile = () => {

    const [blockScroll, allowScroll] = useScrollBlock();
    const [isLoggedIn, setLoggedInStatus] = useState(false);
    const [authTime, setAuthTime] = useState(null);
    const [expTime, setExpTime] = useState(null);
    const [isLoading, setLoading] = useState(true);

    // blockScroll();
    const { authStatus } = useAuthenticator(context => [context.authStatus]);
    // const authStatus = 'authenticated';
    // const handleOpen = () => {
    //     setCloseBackdrop(false);
        // <div>
        //     <Backdrop
        //         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        //         open={closeBackdrop}
        //     >
        //         <CircularProgress color="inherit" />
        //     </Backdrop>
        // </div>
    // };

    // const handleClose = () => {
    //     setCloseBackdrop(true);
    // };

    // async function checkIfUserIsLogged () {
    //     const status = useAuthenticator(context => [context.authStatus]);

    // }

    useEffect(() => {
        console.log('Here');
    });

    const fetchAuthTime = async () => {
        try {
            await getAccessToken();
            const rawToken = localStorage.getItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`);
            const decodedToken = jwtDecode(rawToken);
            console.log('ACCESS TOKEN ->', rawToken);
            setAuthTime(decodedToken.auth_time);
            setExpTime(decodedToken.exp);
            console.log('Auth data fetched successfully');
            // console.log(accessToken.payload.auth_time);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }

    const formatDateFromUnix = (date) => {
        const options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        
        const formattedDate = new Date(date * 1000).toLocaleString('pl-PL', options);
        return formattedDate;
    }
    if (authStatus !== 'authenticated' && authStatus !== 'unauthenticated') {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={authStatus !== 'authenticated' && authStatus !== 'unauthenticated'}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
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
                        <Nav.Link className="roboto-navbar underline-link" href="/game">PLAY</Nav.Link>   
                    </Nav>
                </Container>
            </Navbar>
            <Col sm={12} className={`${classes.mainColumn}`}>
                {authStatus === 'authenticated' ? null :
                    <div className={`${classes.notSignedColumn}`}>
                        <Alert severity="error">
                            <AlertTitle>Not signed in</AlertTitle>
                            Please sign in first using Amazon  AWS identity provider.
                        </Alert>
                        {/* <p className={`roboto-light ${classes.notSignedText}`}>Please sign in!</p> */}
                        <div className={`${classes.line}`}/>
                    </div>
                }
                <Authenticator>
                    {({ signOut, user }) => {
                        setLoggedInStatus(true);
                        fetchAuthTime();
                        return (
                            <Col sm={12} className={`${classes.contentColumn}`}>
                                <h1 className={`${classes.headerText}`}>YOUR PROFILE</h1>
                                <div className={`${classes.line}`}/>
                                <Row className={`${classes.detailsRow}`}>
                                    <Col className={`${classes.detailsColumn}`}>
                                        <p className={`${classes.detailsText}`}>Username: {user.username}</p>
                                        <p className={`${classes.detailsText}`}>Authenticated at: {formatDateFromUnix(authTime)}</p>
                                        <p className={`${classes.detailsText}`}>Token expires at: {formatDateFromUnix(expTime)}</p>
                                    </Col>
                                    <Col className={`${classes.halfColumn}`}>
                                        <button className={`${classes.leaveButton}`} onClick={ () => { setLoggedInStatus(false); signOut(); window.location.reload(); } }><span className="text">Sign out</span></button>
                                    </Col>
                                </Row>
                            </Col>
                        );
                    }}
                </Authenticator>
            </Col>
        </Container>
    );
}

export default Profile;