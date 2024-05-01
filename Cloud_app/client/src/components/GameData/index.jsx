import { useState } from "react";
import Board from "../Board"
import { Col, Row } from 'react-bootstrap';
import classes from './GameData.module.css';
import PreventUnload from '../../PreventUnload';

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
            {/* {isLoggedIn ? null :
                <div className={`${classes.notSignedColumn}`}>
                    <p className={`roboto-light ${classes.notSignedText}`}>You have to log in to play the game!</p>
                    <div className={`${classes.line}`}/>
                </div>
            }
            <Row sm={12}>
              <hr></hr>
              <h2>Hi {username},</h2>
              <h2>you are playing against: {opponentUsername}</h2>
            </Row> */}
            <div className={`${classes.gameContainer}`}>
                <Board playerMark={ playerMark } conn={ conn } username={ username } setPlayersTurn={ setPlayersTrun }></Board>
                { /*LEAVE GAME BUTTON */ }
            </div>
        </Col>
    )
}

export default GameData