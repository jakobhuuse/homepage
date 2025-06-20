export type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
};

export type Move = {
  from: [number, number];
  to: [number, number];
};

export type Board = (Piece | null)[][];