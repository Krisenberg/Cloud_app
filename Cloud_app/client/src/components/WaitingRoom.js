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
import { getCurrentUser } from 'aws-amplify/auth';
import { Col, Row, Form, Button } from 'react-bootstrap';

const WaitingRoom = ({ isLoggedIn, joinGame }) => {
    const [username, setUsername] = useState('');

    return (
        <Form onSubmit={e => {
            e.preventDefault();
            joinGame(username);
        }}>
            <Row className='px-5 py-5'>
                <Col sm={12}>
                    <Form.Group>
                        <Form.Control placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col sm={12}>
                    {isLoggedIn ? null : <p style={{ color: 'red' }}>Please sign in first!</p>}
                    <hr />
                    <Button variant='success' type='submit' disabled={!isLoggedIn}>Play</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default WaitingRoom;