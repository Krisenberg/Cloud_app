import React, { useState } from "react";
import Square from "./Square";

const Board = ({ playerMark, conn, username}) => {
    const [board, setBoard] = useState(["","","","","","","","",""]);
    const [turn, setTurn] = useState("X");

    conn.on("SetMove", (movePosition) => {
        console.log("Move made at: ", movePosition);
        var opponentMark = (playerMark === "X") ? "O" : "X";
        var mark = (playerMark === turn) ? playerMark : opponentMark;
        setBoard(board.map((val, idx) => {
            if (idx === movePosition && val === "") {
                return mark;
            }
            return val;
        }))
        setTurn(turn === "X" ? "O" : "X");        
    })

    const chooseSquare = (square) => {
        console.log("player: ", playerMark, "square: ", square)
        if (turn === playerMark && board[square] === "") {
            conn.invoke("SetMove", square, username);
        }
    };

    return(
        <div id="cellContainer" className="board">
            <Square
                chooseSquare={() => {
                    chooseSquare(0);
                }}
                val={board[0]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(1);
                }}
                val={board[1]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(2);
                }}
                val={board[2]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(3);
                }}
                val={board[3]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(4);
                }}
                val={board[4]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(5);
                }}
                val={board[5]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(6);
                }}
                val={board[6]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(7);
                }}
                val={board[7]}
                playerTurn={turn === playerMark}>
            </Square>
            <Square
                chooseSquare={() => {
                    chooseSquare(8);
                }}
                val={board[8]}
                playerTurn={turn === playerMark}>
            </Square>
            {/* <div className="row">
                <Square val={board[0]}></Square>
                <Square val={board[1]}></Square>
                <Square val={board[2]}></Square>
            </div>
            <div className="row">
                <Square val={board[3]}></Square>
                <Square val={board[4]}></Square>
                <Square val={board[5]}></Square>
            </div>
            <div className="row">
                <Square val={board[6]}></Square>
                <Square val={board[7]}></Square>
                <Square val={board[8]}></Square>
            </div> */}
        </div>
    );
}

export default Board