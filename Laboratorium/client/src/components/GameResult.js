import { Col } from 'react-bootstrap';

const GameResult = ({ hasUserWon, isDraw }) => {
    if(isDraw) {
        return (
            <Col className='px-5 py-5'>
                <h2>Draw!</h2>
            </Col>
        )
    }
    if(hasUserWon) {
        return (
            <Col className='px-5 py-5'>
                <h2>Congratulations!</h2>
                <hr></hr>
                <h2>You won!</h2>
            </Col>
        )
    }
    return (
        <Col className='px-5 py-5'>
            <h2>You lost...</h2>
        </Col>
    )
}

export default GameResult;