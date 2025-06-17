import React from "react";

export default function Chessboard() {
  const rows = Array.from({ length: 8 }, (_, i) => i);
  const cols = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="w-full aspect-square max-w-screen-md grid grid-cols-8">
      {rows.flatMap((row) =>
        cols.map((col) => {
          const isDark = (row + col) % 2 === 1;
          return (
            <div
              key={`${row}-${col}`}
              className={`w-full h-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
