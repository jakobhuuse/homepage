import { useState } from "react";
import GameProfile from "../profile/game-profile";
import Chessboard from "./chessboard";
import { Piece, Move } from "./types";

export default function ChessGame() {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  
  const handlePieceSelect = (piece: Piece) => {
    setSelectedPiece(piece);
    // Logic to determine possible moves for the selected piece
    const moves = calculatePossibleMoves(piece);
    setPossibleMoves(moves);
  };

  const calculatePossibleMoves = (piece: Piece): Move[] => {
    // Implement the logic to calculate possible moves based on the piece type and position
    return []; // Return an array of possible moves
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <GameProfile name={"Test"} />
      <Chessboard 
        onPieceSelect={handlePieceSelect} 
        selectedPiece={selectedPiece} 
        possibleMoves={possibleMoves} 
      />
      <GameProfile name={"Test"} />
    </div>
  );
}