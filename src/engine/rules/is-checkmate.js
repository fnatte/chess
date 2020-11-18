import { isCellColor } from "../utils";
import { findBoardIndices } from "../board";
import getPieceMoves from "./get-piece-moves";
import isCheck from "./is-check";

function hasMoves(board, color) {
  const indices = findBoardIndices(board, (cell) => isCellColor(cell, color));
  return indices.some(
    (fromIndex) => getPieceMoves(board, fromIndex).length > 0
  );
}

export default function isCheckmate(board, color) {
  return isCheck(board, color) && !hasMoves(board, color);
}
