import { useState } from "react";
import classes from './WaitingRoom.module.css';
import { Col, Form } from 'react-bootstrap';

const WaitingRoom = ({ isLoggedIn, joinGame }) => {
    const [username, setUsername] = useState('');

    return (
        <Form onSubmit={e => {
            e.preventDefault();
            if (username.trim() !== "") {
                joinGame(username);
            } else {
                console.log("Username cannot be empty");
            }
        }}>
            <Col sm={12} className={`${classes.contentColumn}`}>
                <Form.Group>
                    <Form.Control className={`${classes.usernameInput}`} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={!isLoggedIn}/>
                </Form.Group>
                <button className={isLoggedIn ? "customButton" : "customButtonDisabled"} role="button" type="submit"><span className="text">Play</span></button>
            </Col>
        </Form>
    );
}

export default WaitingRoom;