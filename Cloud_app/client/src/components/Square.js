import React from "react";

const Square = ({ chooseSquare, val, playerTurn}) => {
    if (!playerTurn || val !== "")
        return (
            <div className="non-clickable-cell" onClick={ chooseSquare }>
                {val}
            </div>
        )
    return(
        <div className="cell" onClick={ chooseSquare }>
            {val}
        </div>
    )
}

export default Square;