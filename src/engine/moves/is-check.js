import { PieceColor, PieceType } from "../constants";
import { findBoardIndices } from "../board";
import { getCellPiece, isWhite, isBlack } from "../utils";
import getMoves from "./get-moves";

function capturesKing(board, toIndex) {
  return getCellPiece(board[toIndex]) === PieceType.king;
}

export default function isCheck(board, color) {
  // Player is check if the opponent can capture its king the upcoming move.
  const otherPlayerColorCheck = color === PieceColor.white ? isBlack : isWhite;
  const indices = findBoardIndices(board, otherPlayerColorCheck);
  return indices.some((fromIndex) =>
    getMoves(board, fromIndex).some((toIndex) => capturesKing(board, toIndex))
  );
}
