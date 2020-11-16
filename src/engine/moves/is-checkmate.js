import { isCellColor } from "../utils";
import { findBoardIndices } from "../board";
import { getMoves } from ".";
import isCheck from "./is-check";

function hasMoves(board, color) {
  const indices = findBoardIndices(board, (cell) => isCellColor(cell, color));
  return indices.some((fromIndex) => getMoves(board, fromIndex).length > 0);
}

export default function isCheckmate(board, color) {
  return isCheck(board, color) && !hasMoves(board, color);
}
