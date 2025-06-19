import Image from "next/image";

export default function Chessboard() {
  const pieceToSvg: Record<string, string> = {
    b_rook: "rook-b.svg",
    b_knight: "knight-b.svg",
    b_bishop: "bishop-b.svg",
    b_queen: "queen-b.svg",
    b_king: "king-b.svg",
    b_pawn: "pawn-b.svg",
    w_rook: "rook-w.svg",
    w_knight: "knight-w.svg",
    w_bishop: "bishop-w.svg",
    w_queen: "queen-w.svg",
    w_king: "king-w.svg",
    w_pawn: "pawn-w.svg",
  };

  const initialBoard: (string | null)[][] = [
    [
      "b_rook",
      "b_knight",
      "b_bishop",
      "b_queen",
      "b_king",
      "b_bishop",
      "b_knight",
      "b_rook",
    ],
    [
      "b_pawn",
      "b_pawn",
      "b_pawn",
      "b_pawn",
      "b_pawn",
      "b_pawn",
      "b_pawn",
      "b_pawn",
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      "w_pawn",
      "w_pawn",
      "w_pawn",
      "w_pawn",
      "w_pawn",
      "w_pawn",
      "w_pawn",
      "w_pawn",
    ],
    [
      "w_rook",
      "w_knight",
      "w_bishop",
      "w_queen",
      "w_king",
      "w_bishop",
      "w_knight",
      "w_rook",
    ],
  ];

  const rows = Array.from({ length: 8 }, (_, i) => i);
  const cols = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="aspect-square grid grid-cols-8 w-full">
      {rows.flatMap((row) =>
        cols.map((col) => {
          const isDark = (row + col) % 2 === 1;
          const piece = initialBoard[row][col];
          const pieceImageSrc = piece
            ? `/games/chess/pieces/${pieceToSvg[piece]}`
            : null;

          return (
            <div
              key={`${row}-${col}`}
              className={`w-full h-full flex items-center justify-center relative ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              {pieceImageSrc && (
                <Image src={pieceImageSrc} alt={piece || ""} fill priority />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
