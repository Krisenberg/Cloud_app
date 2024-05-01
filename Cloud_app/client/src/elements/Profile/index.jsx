import React from "react";
import classes from './Profile.module.css';
import { useNavigate } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { Col, Navbar, Container, Nav } from 'react-bootstrap';
import '../../styles/App.css'
import useScrollBlock from '../../useScrollBlock';

const Profile = () => {

    const [blockScroll, allowScroll] = useScrollBlock();

    blockScroll();

    return (
        <Container className="profile-container">
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
                <div className={`${classes.fullScreenContainer}`}>
                    <Authenticator>
                        {({ signOut, user }) => {
                            return (
                                <main>
                                    <h1>Hello {user.username}, you are already signed in!</h1>
                                    <button className="customButton" onClick={() => { signOut(); }}>Sign out</button>
                                </main>
                            );
                        }}
                    </Authenticator>
                </div>
            </Col>
        </Container>
    );
}

export default Profile;