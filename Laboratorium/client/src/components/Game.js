import Board from "./Board"

const Game = ({ playerMark, conn, username }) => {

    return (
        <div className="gameContainer">
            <Board playerMark={ playerMark } conn={ conn } username={ username }>
            </Board>
            { /*LEAVE GAME BUTTON */ }
        </div>
    )
}

export default Game