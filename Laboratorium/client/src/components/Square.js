import React from "react";

const Square = ({ chooseSquare, val }) => {
    return(
        <div className="cell" onClick={ chooseSquare }>
            {val}
        </div>
    )
}

export default Square;