import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Square } from "chess.js";
import { capturedObjs } from "../utils/imageConstants";
import TimeDisplay from "../components/timer";
import Moves from "../components/Move";
import Modal from "../components/result";

const ChessGame: React.FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [whiteCaptured, setWhiteCaptured] = useState<string[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("White");
  // const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  // Function to handle making a move
  function makeAMove(move: {
    from: Square;
    to: Square;
    promotion?: string;
  }): Move | null {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result && result.captured) {
      if (result.color === "w") {
        setBlackCaptured([...blackCaptured, result.captured]);
      } else {
        setWhiteCaptured([...whiteCaptured, result.captured]);
      }
    }

    setGame(gameCopy);

    // Check for game over
    if (gameCopy.isGameOver()) {
      if (gameCopy.isDraw()) {
        setWinner(null); // It’s a draw
      } else {
        setWinner(gameCopy.turn() === "w" ? "Black" : "White");
      }
      setIsModalOpen(true); // Show modal with result
    } else {
      setCurrentPlayer(gameCopy.turn() === "w" ? "White" : "Black");
    }
    setPossibleMoves([]);
    // setSelectedSquare(null);
    return result;
  }

  // Handle piece drop
  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    return true;
  }

  const onPieceClick = (square: Square) => {
    if (game.get(square)) {
      const moves = game
        .moves({ square, verbose: true })
        .map((move) => move.to);

      setPossibleMoves(moves);
    }
  };

  const renderCapturedPieces = (pieces: string[], str: string) => {
    return pieces.map((piece, index) => (
      <div key={index} className="captured-piece">
        <img
          src={
            capturedObjs[
              (str + piece.toUpperCase()) as keyof typeof capturedObjs
            ]
          }
          alt=""
          width={50}
          height={50}
        />
      </div>
    ));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGame(new Chess()); // Reset game
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setCurrentPlayer("White");
  };

  const squareStyles = possibleMoves.reduce(
    (acc, square) => ({
      ...acc,
      [square]: {
        backgroundColor: "rgba(255, 255, 0, 0.5)",
      },
    }),
    {}
  );

  return (
    <div className="flex justify-center items-center h-[100vh] bg-transparent">
      <div className="flex justify-center flex-col laptop:flex-row relative">
        <div className="m-4 hidden laptop:block">
          <h2 className="text-black">White's Captured Pieces</h2>
          <div className="flex flex-col flex-wrap h-[60vh]">
            {renderCapturedPieces(whiteCaptured, "w")}
          </div>
        </div>

        <div className="flex justify-center items-center w-full laptop:w-[40vw] laptop:mt-[5%]">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onPieceClick}
            customSquareStyles={
              possibleMoves.length > 0
                ? {
                    ...squareStyles,
                  }
                : {}
            }
          />
        </div>
        <div className="m-4 block laptop:hidden">
          <h2 className="text-black">White's Captured Pieces</h2>
          <div className="flex flex-row flex-wrap laptop:h-[60vh]">
            {renderCapturedPieces(whiteCaptured, "w")}
          </div>
        </div>
        <div className="m-4">
          <h2 className="text-black">Black's Captured Pieces</h2>
          <div className="flex laptop:flex-col flex-row flex-wrap laptop:h-[60vh]">
            {renderCapturedPieces(blackCaptured, "b")}
          </div>
        </div>

        <Moves player={currentPlayer} />
        <TimeDisplay totalSeconds={0} />
        <Modal isOpen={isModalOpen} winner={winner} onClose={closeModal} />
      </div>
    </div>
  );
};

export default ChessGame;
