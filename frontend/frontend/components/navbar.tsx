import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white">Home</Link>
        </li>
        <li>
          <Link href="/about" className="text-white">About</Link>
        </li>
        <li>
          <Link href="/games/chess" className="text-white">Chess</Link>
        </li>
        <li>
          <Link href="/games/sudoku" className="text-white">Sudoku</Link>
        </li>
        <li>
          <Link href="/games/tictactoe" className="text-white">Tic Tac Toe</Link>
        </li>
        <li>
          <Link href="/games/minesweeper" className="text-white">Minesweeper</Link>
        </li>
      </ul>
    </nav>
  );
}