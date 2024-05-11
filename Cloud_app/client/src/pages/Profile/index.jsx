import classes from './Profile.module.css';
import { Authenticator, Alert, Flex, Divider } from '@aws-amplify/ui-react';
import { Col, Row, Navbar, Container, Nav } from 'react-bootstrap';
import '../../styles/App.css'
import useScrollBlock from '../../utils/useScrollBlock';
import { useState, useEffect } from "react";
import getAccessToken from '../../utils/AuthTokens';
import { jwtDecode } from 'jwt-decode';


const Profile = () => {

    const [blockScroll, allowScroll] = useScrollBlock();
    const [isLoggedIn, setLoggedInStatus] = useState(false);
    const [authTime, setAuthTime] = useState(null);

    // blockScroll();

    const fetchAuthTime = async () => {
        try {
            const accessToken = await getAccessToken();
            setAuthTime(accessToken.payload.auth_time);
            console.log('Data fetched successfully');
            console.log(authTime);
            // console.log(accessToken.payload.auth_time);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const formatDateFromUnix = () => {
        const options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        
        const formattedDate = new Date(authTime * 1000).toLocaleString('pl-PL', options);
        return formattedDate;
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
            {/* <Flex direction="column">
                {isLoggedIn ? null :
                    <Flex direction="column">
                        <Alert variation="error">Please sign in!</Alert>
                        <Divider
                            className={`${classes.customDivider}`}
                            label="wrg"
                            size="large"
                            orientation="horizontal" />
                    </Flex>
                }
                <Authenticator>
                    {({ signOut, user }) => {
                        setLoggedInStatus(true);
                        fetchAuthTime();
                        // const time = authTime ? authTime : "";
                        return (
                            <Col sm={12} className={`${classes.contentColumn}`}>
                                <h1 className={`${classes.headerText}`}>YOUR PROFILE</h1>
                                <div className={`${classes.line}`}/>
                                <Row className={`${classes.detailsRow}`}>
                                    <Col className={`${classes.detailsColumn}`}>
                                        <p className={`${classes.detailsText}`}>Username: {user.username}</p>
                                        <p className={`${classes.detailsText}`}>Authenticated at: {formatDateFromUnix()}</p>
                                    </Col>
                                    <Col className={`${classes.halfColumn}`}>
                                        <button className={`${classes.leaveButton}`} onClick={ () => { setLoggedInStatus(false); signOut(); window.location.reload(); } }><span className="text">Sign out</span></button>
                                    </Col>
                                </Row>
                            </Col>
                        );
                    }}
                </Authenticator>
            </Flex> */}
            <Col sm={12} className={`${classes.mainColumn}`}>
                {isLoggedIn ? null :
                    <div className={`${classes.notSignedColumn}`}>
                        <p className={`roboto-light ${classes.notSignedText}`}>Please sign in!</p>
                        <div className={`${classes.line}`}/>
                    </div>
                }
                
                <Authenticator>
                    {({ signOut, user }) => {
                        setLoggedInStatus(true);
                        fetchAuthTime();
                        // const time = authTime ? authTime : "";
                        return (
                            <Col sm={12} className={`${classes.contentColumn}`}>
                                <h1 className={`${classes.headerText}`}>YOUR PROFILE</h1>
                                <div className={`${classes.line}`}/>
                                <Row className={`${classes.detailsRow}`}>
                                    <Col className={`${classes.detailsColumn}`}>
                                        <p className={`${classes.detailsText}`}>Username: {user.username}</p>
                                        <p className={`${classes.detailsText}`}>Authenticated at: {formatDateFromUnix()}</p>
                                    </Col>
                                    <Col className={`${classes.halfColumn}`}>
                                        <button className={`${classes.leaveButton}`} onClick={ () => { setLoggedInStatus(false); signOut(); window.location.reload(); } }><span className="text">Sign out</span></button>
                                    </Col>
                                </Row>
                            </Col>
                            // <main>
                            //     <Col sm={12} className={`${classes.contentColumn}`}>
                            //         <h1 className={`${classes.headerText}`}>YOUR PROFILE</h1>
                            //         <div className={`${classes.line}`}/>
                            //         <Row className={`${classes.detailsRow}`}>
                            //             <Col className={`${classes.halfColumn}`}>
                            //                 <p>Username: {user.username}</p>
                            //                 <p>Authenticated at: ...</p>
                            //             </Col>
                            //             <Col className={`${classes.halfColumn}`}>
                            //                 <button className={`${classes.leaveButton}`} role="button" type="submit"><span className="text">Leave</span></button>
                            //             </Col>
                            //         </Row>
                            //     </Col>
                            //     {/* <h1>Hello {user.username}, you are already signed in!</h1>
                            //     <button className="customButton" onClick={ () => { setLoggedInStatus(false); signOut(); window.location.reload(); } }>Sign out</button> */}
                            // </main>
                        );
                    }}
                </Authenticator>
            </Col>
        </Container>
    );
}

export default Profile;