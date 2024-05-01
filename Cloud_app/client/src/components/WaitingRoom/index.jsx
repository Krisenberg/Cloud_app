// import { useState } from "react";
// import { Col, Row, Form, Button } from 'react-bootstrap';

// const WaitingRoom = ({ joinGame }) => {
//     const[username, setUsername] = useState();

//     return <Form onSubmit={ e => {
//         e.preventDefault();
//         joinGame(username);
//     }}>
//         <Row className='px-5 py-5'>
//             <Col sm={12}>
//                 <Form.Group>
//                     <Form.Control placeholder="Username" onChange = {e => setUsername(e.target.value)}>
//                     </Form.Control>
//                 </Form.Group>
//             </Col>
//             <Col sm={12}>
//                 <hr></hr>
//                 <Button variant='success' type='submit'>Play</Button>
//             </Col>
//         </Row>
//     </Form>
// }

// export default WaitingRoom;
import { useState, useEffect } from "react";
import classes from './WaitingRoom.module.css';
import { getCurrentUser } from 'aws-amplify/auth';
import { Col, Row, Form, Button } from 'react-bootstrap';

const WaitingRoom = ({ isLoggedIn, joinGame }) => {
    const [username, setUsername] = useState('');

    return (
        <Form onSubmit={e => {
            e.preventDefault();
            if (username.trim() !== "") {
                joinGame(username);
            } else {
                // Optionally provide feedback to the user that username cannot be empty
                console.log("Username cannot be empty");
            }
            // e.preventDefault();
            // joinGame(username);
        }}>
            <Col sm={12} className={`${classes.contentColumn}`}>
                <Form.Group>
                    <Form.Control className={`${classes.usernameInput}`} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={!isLoggedIn}/>
                </Form.Group>
                <button className={isLoggedIn ? "customButton" : "customButtonDisabled"} role="button" type="submit"><span className="text">Play</span></button>
            </Col>
            {/* <Row className='px-5 py-5'>
                <Col sm={12}>
                    <Form.Group>
                        <Form.Control placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col sm={12}>
                    <button className="customButton" role="button" disabled={!isLoggedIn} type="submit"><span className="text">Play</span></button>
                </Col>
            </Row> */}
        </Form>
    );
}

export default WaitingRoom;