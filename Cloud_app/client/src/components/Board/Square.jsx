import React from "react";
import classes from './Board.module.css';

const Square = ({ chooseSquare, val, playerTurn, isPlayerCell}) => {
    if (!playerTurn || val !== "") {
        return (
            <div className={val === "" ? `${classes.disabledCell}` : (isPlayerCell ? `${classes.occupiedCellGreen}` : `${classes.occupiedCellRed}`)}>
                <p className={`${classes.cellMark}`}>{val}</p>
            </div>
        )
    }
    return(
        <div className={`${classes.cell}`} onClick={ chooseSquare }>
            <p className={`${classes.cellMark}`}>{val}</p>
        </div>
    )
}

export default Square;