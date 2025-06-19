import GameProfile from "../profile/game-profile";
import Chessboard from "./chessboard";

export default function ChessGame() {
  return (
    <div className="flex flex-col items-start gap-2">
      <GameProfile name={"Test"}></GameProfile>
      <Chessboard />
      <GameProfile name={"Test"}></GameProfile>
    </div>
  );
}
