import { PieceType, PieceColor } from './constants';

export function emptyBoard() {
  return Array(64).fill(PieceType.empty);
}

export function findBoardIndices(board, fn) {
  return board.reduce((indices, cell, index) => {
    if (fn(cell)) {
      indices.push(index);
    }

    return indices;
  }, []);
}

export function cell(pieceType, pieceColor) {
  return pieceType | pieceColor;
}

export function createBoard() {
  const board = emptyBoard();

  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[8 + i] = PieceType.pawn | PieceColor.white;
    board[48 + i] = PieceType.pawn | PieceColor.black;
  }

  // Place other white pieces
  board[0] = PieceType.rook | PieceColor.white;
  board[1] = PieceType.knight | PieceColor.white;
  board[2] = PieceType.bishop | PieceColor.white;
  board[3] = PieceType.queen | PieceColor.white;
  board[4] = PieceType.king | PieceColor.white;
  board[5] = PieceType.bishop | PieceColor.white;
  board[6] = PieceType.knight | PieceColor.white;
  board[7] = PieceType.rook | PieceColor.white;

  // Place other black pieces
  board[56] = PieceType.rook | PieceColor.black;
  board[57] = PieceType.knight | PieceColor.black;
  board[58] = PieceType.bishop | PieceColor.black;
  board[59] = PieceType.queen | PieceColor.black;
  board[60] = PieceType.king | PieceColor.black;
  board[61] = PieceType.bishop | PieceColor.black;
  board[62] = PieceType.knight | PieceColor.black;
  board[63] = PieceType.rook | PieceColor.black;

  return board;
};

export function placePiece(board, desc) {
  const newBoard = board.slice();
  newBoard[desc.index] = cell(desc.type, desc.color);

  return newBoard;
}

