import Board from "./Board"
import { Col, Row } from 'react-bootstrap';

const WaitingForOpponent = ({ playerMark, conn, username, opponentUsername }) => {

    return (
        <Col className='px-5 py-5'>
            <Row sm={12}>
              <hr></hr>
              <h2>Hi {username},</h2>
              <h2>you are playing against: {opponentUsername}</h2>
            </Row>
            <div className="gameContainer">
                <Board playerMark={ playerMark } conn={ conn } username={ username }>
                </Board>
                { /*LEAVE GAME BUTTON */ }
            </div>
        </Col>
    )
}

export default WaitingForOpponent