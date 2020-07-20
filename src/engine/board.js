import { PieceType, PieceColor } from "./constants";
import { getCellValue } from "./utils";

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

export function createBoard() {
  const board = emptyBoard();

  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[8 + i] = getCellValue(PieceType.pawn, PieceColor.white);
    board[48 + i] = getCellValue(PieceType.pawn, PieceColor.black);
  }

  // Place other white pieces
  board[0] = getCellValue(PieceType.rook, PieceColor.white);
  board[1] = getCellValue(PieceType.knight, PieceColor.white);
  board[2] = getCellValue(PieceType.bishop, PieceColor.white);
  board[3] = getCellValue(PieceType.queen, PieceColor.white);
  board[4] = getCellValue(PieceType.king, PieceColor.white);
  board[5] = getCellValue(PieceType.bishop, PieceColor.white);
  board[6] = getCellValue(PieceType.knight, PieceColor.white);
  board[7] = getCellValue(PieceType.rook, PieceColor.white);

  // Place other black pieces
  board[56] = getCellValue(PieceType.rook, PieceColor.black);
  board[57] = getCellValue(PieceType.knight, PieceColor.black);
  board[58] = getCellValue(PieceType.bishop, PieceColor.black);
  board[59] = getCellValue(PieceType.queen, PieceColor.black);
  board[60] = getCellValue(PieceType.king, PieceColor.black);
  board[61] = getCellValue(PieceType.bishop, PieceColor.black);
  board[62] = getCellValue(PieceType.knight, PieceColor.black);
  board[63] = getCellValue(PieceType.rook, PieceColor.black);

  return board;
}

export function placePiece(board, desc) {
  const newBoard = board.slice();
  newBoard[desc.index] = getCellValue(desc.type, desc.color);

  return newBoard;
}
