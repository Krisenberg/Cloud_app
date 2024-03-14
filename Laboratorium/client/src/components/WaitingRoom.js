import { useState } from "react";
import { Col, Row, Form, Button } from 'react-bootstrap';

const WaitingRoom = ({ joinGame }) => {
    const[username, setUsername] = useState();

    return <Form onSubmit={ e => {
        e.preventDefault();
        joinGame(username);
    }}>
        <Row className='px-5 py-5'>
            <Col sm={12}>
                <Form.Group>
                    <Form.Control placeholder="Username" onChange = {e => setUsername(e.target.value)}>
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col sm={12}>
                <hr></hr>
                <Button variant='success' type='submit'>Play</Button>
            </Col>
        </Row>
    </Form>
}

export default WaitingRoom;