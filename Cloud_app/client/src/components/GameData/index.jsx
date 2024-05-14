import { useState } from "react";
import Board from "../Board"
import { Col, Row } from 'react-bootstrap';
import classes from './GameData.module.css';
import PreventUnload from '../../utils/PreventUnload';

const GameData = ({ playerMark, conn, username, opponentUsername }) => {

    const [currentMark, setPlayersTrun] = useState('X');

    return (
        <Col sm={12} className={`${classes.contentColumn}`}>
            <PreventUnload />
            <Row className={`${classes.topRow}`}>
                <Col className={`${classes.halfColumn}`}>
                    <div>
                        {username} '<span className={`${classes.playerColor}`}>{playerMark}</span>' [you]   -   {opponentUsername} '<span className={`${classes.opponentColor}`}>{playerMark === 'X' ? 'O' : 'X'}</span>'
                    </div>
                    <div>
                        Move: <span className={currentMark === playerMark ? `${classes.playerColor}` : `${classes.opponentColor}`}>{currentMark}</span>
                    </div>
                </Col>
                <div className={`${classes.verticalLine}`}/>
                <Col className={`${classes.halfColumn}`}>
                    <button className={`${classes.leaveButton}`} role="button" type="submit"><span className="text">Leave</span></button>
                </Col>
            </Row>
            <div className={`${classes.line}`}/>
            <div className={`${classes.gameContainer}`}>
                <Board playerMark={ playerMark } conn={ conn } username={ username } setPlayersTurn={ setPlayersTrun }></Board>
            </div>
        </Col>
    )
}

export default GameData