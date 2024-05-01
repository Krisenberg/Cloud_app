import classes from './Profile.module.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Col, Navbar, Container, Nav } from 'react-bootstrap';
import '../../styles/App.css'
import useScrollBlock from '../../useScrollBlock';
import { useState, useEffect } from "react";

const Profile = () => {

    const [blockScroll, allowScroll] = useScrollBlock();
    const [isLoggedIn, setLoggedInStatus] = useState(false);

    blockScroll();

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
            <Col sm={12}>
                {isLoggedIn ? null :
                    <div className={`${classes.notSignedColumn}`}>
                        <p className={`roboto-light ${classes.notSignedText}`}>Please sign in!</p>
                        <div className={`${classes.line}`}/>
                    </div>
                }
                
                <Authenticator>
                    {({ signOut, user }) => {
                        setLoggedInStatus(true);
                        return (
                            <main>
                                <h1>Hello {user.username}, you are already signed in!</h1>
                                <button className="customButton" onClick={ () => { setLoggedInStatus(false); signOut(); window.location.reload(); } }>Sign out</button>
                            </main>
                        );
                    }}
                </Authenticator>
            </Col>
        </Container>
    );
}

export default Profile;