import React, { useState } from "react";
import Square from "./Square";
import classes from './Board.module.css';
import { Col, Row } from 'react-bootstrap';

const Board = ({ playerMark, conn, username, setPlayersTurn }) => {
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
        setPlayersTurn(turn === "X" ? "O" : "X");
        setTurn(turn === "X" ? "O" : "X");
    })

    const chooseSquare = (square) => {
        console.log("player: ", playerMark, "square: ", square)
        if (turn === playerMark && board[square] === "") {
            conn.invoke("SetMove", square, username);
        }
    };

    return(
        <Col sm={12} className={`${classes.boardColumn}`}>
            <Row className={`${classes.boardRow}`}>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(0);
                        }}
                        val={board[0]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[0] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(1);
                        }}
                        val={board[1]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[1] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(2);
                        }}
                        val={board[2]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[2] === playerMark}>
                    </Square>
                </Col>
            </Row>

            <Row className={`${classes.boardRow}`}>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(3);
                        }}
                        val={board[3]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[3] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(4);
                        }}
                        val={board[4]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[4] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(5);
                        }}
                        val={board[5]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[5] === playerMark}>
                    </Square>
                </Col>
            </Row>

            <Row className={`${classes.boardRow}`}>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(6);
                        }}
                        val={board[6]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[6] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(7);
                        }}
                        val={board[7]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[7] === playerMark}>
                    </Square>
                </Col>
                <Col className={`${classes.cellColumn}`}>
                    <Square
                        chooseSquare={() => {
                            chooseSquare(8);
                        }}
                        val={board[8]}
                        playerTurn={turn === playerMark}
                        isPlayerCell={board[8] === playerMark}>
                    </Square>
                </Col>
            </Row>
        </Col>
    );
}

export default Board