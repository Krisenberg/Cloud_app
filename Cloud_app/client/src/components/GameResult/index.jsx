import { Col, Row } from 'react-bootstrap';
import classes from './GameResult.module.css';
import { useNavigate } from "react-router-dom";

const GameResult = ({ hasUserWon, isDraw }) => {

    const navigate = useNavigate();

    function navigateToMenu() {
        navigate("/");
    }

    function navigateToPlayAgain() {
        navigate("/game");
    }

    if(isDraw) {
        return (
            // <Col className='px-5 py-5'>
            //     <h2>Draw!</h2>
            // </Col>
            <div className={`${classes.contentContainer}`}>
                <Col sm={12} className={`${classes.contentColumn}`}>
                    <h2 className={`${classes.resultText}`}><span className={`${classes.drawColor}`}>Draw</span></h2>
                    <div className={`${classes.line}`}/>
                    <Col className={`${classes.buttonsRow}`}>
                        <div className={`${classes.halfColumn}`}>
                            <button className={`${classes.customButton} ${classes.playAgainButtonColor}`} onClick={navigateToPlayAgain}><span className="text">Play again</span></button>
                        </div>
                        <div className={`${classes.halfColumn}`}>
                            <button className={`${classes.customButton} ${classes.leaveButtonColor}`} onClick={navigateToMenu}><span className="text">Menu</span></button>
                        </div>
                    </Col>
                </Col>
            </div>
        )
    }
    if(hasUserWon) {
        return (
            // <Col className='px-5 py-5'>
            //     <h2>Congratulations!</h2>
            //     <hr></hr>
            //     <h2>You won!</h2>
            // </Col>
            <div className={`${classes.contentContainer}`}>
                <Col sm={12} className={`${classes.contentColumn}`}>
                    <h2 className={`${classes.resultText}`}><span className={`${classes.winColor}`}>Win</span></h2>
                    <div className={`${classes.line}`}/>
                    <Col className={`${classes.buttonsRow}`}>
                        <div className={`${classes.halfColumn}`}>
                            <button className={`${classes.customButton} ${classes.playAgainButtonColor}`} onClick={navigateToPlayAgain}><span className="text">Play again</span></button>
                        </div>
                        <div className={`${classes.halfColumn}`}>
                            <button className={`${classes.customButton} ${classes.leaveButtonColor}`} onClick={navigateToMenu}><span className="text">Menu</span></button>
                        </div>
                    </Col>
                </Col>
            </div>
        )
    }
    return (
        // <Col className='px-5 py-5'>
        //     <h2>You lost...</h2>
        // </Col>
        <div className={`${classes.contentContainer}`}>
            <Col sm={12} className={`${classes.contentColumn}`}>
                <h2 className={`${classes.resultText}`}><span className={`${classes.lossColor}`}>Loss</span></h2>
                <div className={`${classes.line}`}/>
                <Col className={`${classes.buttonsRow}`}>
                    <div className={`${classes.halfColumn}`}>
                        <button className={`${classes.customButton} ${classes.playAgainButtonColor}`} onClick={navigateToPlayAgain}><span className="text">Play again</span></button>
                    </div>
                    <div className={`${classes.halfColumn}`}>
                        <button className={`${classes.customButton} ${classes.leaveButtonColor}`} onClick={navigateToMenu}><span className="text">Menu</span></button>
                    </div>
                </Col>
            </Col>
        </div>
    )
}

export default GameResult;