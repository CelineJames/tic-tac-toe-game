import { useState, useEffect } from "react";
import GameBoard from "./GameBoard";
import Log from "./Log";
import { WINNING_COMBINATIONS } from "./Winning-combo";
import GameOver from "./GameOver";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveGameBoard(gameTurns) {
  let board = INITIAL_GAME_BOARD.map(row => [...row]);
  for (const turn of gameTurns) {
    const { square, Player } = turn;
    board[square.row][square.col] = Player;
  }
  return board;
}

function deriveWinner(gameBoard) {
  for (const combination of WINNING_COMBINATIONS) {
    const a = gameBoard[combination[0].row][combination[0].column];
    const b = gameBoard[combination[1].row][combination[1].column];
    const c = gameBoard[combination[2].row][combination[2].column];

    if (a && a === b && a === c) return a;
  }
  return null;
}

// Helper: check for win or block opportunity
function getWinningMove(board, symbol) {
  for (const combination of WINNING_COMBINATIONS) {
    const positions = combination.map(pos => board[pos.row][pos.column]);
    const filled = positions.filter(p => p === symbol).length;
    const emptyIndex = positions.findIndex(p => p === null);

    if (filled === 2 && emptyIndex !== -1) {
      const emptyPos = combination[emptyIndex];
      return { row: emptyPos.row, col: emptyPos.column };
    }
  }
  return null;
}

// Smart move logic
function getSmartComputerMove(board, computerSymbol, playerSymbol) {
  // 1. Try to win
  const winningMove = getWinningMove(board, computerSymbol);
  if (winningMove) return winningMove;

  // 2. Block player
  const blockingMove = getWinningMove(board, playerSymbol);
  if (blockingMove) return blockingMove;

  // 3. Take center
  if (board[1][1] === null) return { row: 1, col: 1 };

  // 4. Take corners
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ];
  for (const corner of corners) {
    if (board[corner.row][corner.col] === null) {
      return corner;
    }
  }

  // 5. Always P ick available square 
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (!board[row][col]) {
        return { row, col };
      }
    }
  }

  return null;
}

export default function VsComputerGame({ playClick, soundOn }) {
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [turns, setTurns] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");

  const gameBoard = deriveGameBoard(turns);
  const winner = deriveWinner(gameBoard);
  const hasDrawn = turns.length === 9 && !winner;

  const computerSymbol = playerSymbol === "X" ? "O" : "X";
  const activeSymbol = turns.length % 2 === 0 ? "X" : "O";

  // Smart Computer Move
  useEffect(() => {
    if (
      playerSymbol &&
      activeSymbol === computerSymbol &&
      !winner &&
      !hasDrawn
    ) {
      const move = getSmartComputerMove(gameBoard, computerSymbol, playerSymbol);

      if (move) {
        const timer = setTimeout(() => {
          handleSelectSquare(move.row, move.col);
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [turns, activeSymbol, computerSymbol, gameBoard, playerSymbol, winner, hasDrawn]);

  function handleSelectSymbol(symbol) {
    setPlayerSymbol(symbol);
    setCurrentPlayer("X");
  }

  function handleSelectSquare(rowIndex, colIndex) {
    if (gameBoard[rowIndex][colIndex] || winner) return;

    if (activeSymbol === playerSymbol && soundOn) {
      playClick();
    }

    const newTurn = {
      square: { row: rowIndex, col: colIndex },
      Player: activeSymbol,
    };

    setTurns(prev => [newTurn, ...prev]);
    setCurrentPlayer(activeSymbol === "X" ? "O" : "X");
  }

  function handleRestart() {
    setTurns([]);
    setPlayerSymbol(null);
    setCurrentPlayer("X");
  }

  return (
    <main>
      {!playerSymbol ? (
        <div className="choose-mode">
          <h2 className="">Choose your symbol</h2>
          <div className="choose-buttons">
            <button
              onClick={() => handleSelectSymbol("X")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded m-2"
            >
              Play as X
            </button>
            <button
              onClick={() => handleSelectSymbol("O")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded m-2"
            >
              Play as O
            </button>
          </div>
        </div>
      ) : (
        <>
          <div id="game-container">
            <div className="text-center mb-4">
              <ol id="players" className="highlight-player">
                <li
                  className={currentPlayer === playerSymbol ? "active" : ""}
                  id="players"
                >
                  <span className="players-color">
                    <span className="player">You are :</span>
                    <span className="symbol">
                      <strong>{playerSymbol}</strong>
                    </span>
                  </span>
                </li>
                <li
                  className={currentPlayer === computerSymbol ? "active" : ""}
                  id="players"
                >
                  <span className="players-color">
                    <span className="player">Computer is :</span>
                    <span className="symbol">
                      <strong>{computerSymbol}</strong>
                    </span>
                  </span>
                </li>
              </ol>
            </div>

            {(winner || hasDrawn) && (
              <GameOver
                winner={
                  winner === playerSymbol
                    ? "You Win!"
                    : winner === computerSymbol
                    ? "Computer Wins"
                    : null
                }
                onRestart={handleRestart}
              />
            )}

            <GameBoard onSelectsquare={handleSelectSquare} board={gameBoard} />
          </div>
          <Log turns={turns} />
        </>
      )}
    </main>
  );
}
