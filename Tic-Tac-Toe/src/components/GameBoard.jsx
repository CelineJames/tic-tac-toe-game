
export default function GameBoard({ onSelectsquare, board }){
 
    


    return(
        <ol id="game-board">
            {board.map((row, rowIndex) => <li key={rowIndex}>
                <ol>
                    {row.map((playerSymbol, colIndex) => <li className="target-li" key={colIndex}>
                        <button onClick={() => onSelectsquare(rowIndex, colIndex)} disabled={playerSymbol !== null}> 
                            {playerSymbol}
                            </button>
                    </li>)}
                </ol>
            </li>)}
        </ol>
    )
}