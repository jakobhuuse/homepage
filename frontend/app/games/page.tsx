import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"; // Adjust import path as needed

type Game = {
  title: string;
  image: string;
  href: string;
};

const games: Game[] = [
  {
    title: "Chess",
    image: "/games/chess.png",
    href: "/games/chess",
  },

  {
    title: "Sudoku",
    image: "/games/sudoku.png",
    href: "/games/sudoku",
  },
  {
    title: "Tic Tac Toe",
    image: "/games/tictactoe.png",
    href: "/games/tictactoe",
  },
  {
    title: "Minesweeper",
    image: "/games/minesweeper.png",
    href: "/games/minesweeper",
  },
];

export default function GamesPage() {
  return (
    <main>
      <h1>Games</h1>
      <div className="grid md:grid-cols-4 gap-8">
        {games.map((game) => (
          <Link href={game.href} key={game.title}>
            <Card className="h-full aspect-square cursor-pointer transition-shadow hover:shadow-lg flex flex-col">
              <div className="w-full flex-1 relative">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-contain w-full h-full"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
