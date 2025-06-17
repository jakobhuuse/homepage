import Chessboard from "@/components/chessboard";
import GameProfile from "@/components/profile/game-profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function ChessPage() {
  return (
    <main>
      <div className="flex flex-col items-start gap-2">
        <GameProfile name={"Test"}></GameProfile>
        <Chessboard />
        <GameProfile name={"Test"}></GameProfile>
      </div>
    </main>
  );
}
