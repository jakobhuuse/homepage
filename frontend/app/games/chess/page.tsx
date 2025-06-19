import ChessGame from "@/components/chess/chess-game";

export default function ChessPage() {
  return (
    <main className="flex justify-center gap-4">
      <div className="w-full md:w-5/8 md:max-w-2xl">
        <ChessGame />
      </div>
      <div className="hidden md:block md:w-3/8">
        <h1>Placeholder</h1>
      </div>
    </main>
  );
}
