import { Col, Row } from 'react-bootstrap';
import classes from './GameResult.module.css';
import { useNavigate } from "react-router-dom";

const GameResult = ({ hasUserWon, isDraw }) => {

    const navigate = useNavigate();

    function navigateToMenu() {
        navigate("/");
    }

    function navigateToPlayAgain() {
        window.location.reload();
    }

    if(isDraw) {
        return (
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