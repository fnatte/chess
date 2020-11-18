import { pipe, prop, __ } from "ramda";
import { getCellPiece, getPieceName } from "../utils";
import moveGetters from "./move-getters";

const getPieceMovesFunctionByCell = pipe(
  getCellPiece,
  getPieceName,
  prop(__, moveGetters)
);

const getPieceMoves = (board, index) => {
  const cell = board[index];
  const fn = getPieceMovesFunctionByCell(cell);
  if (!fn) {
    throw new Error(`Failed to find piece move funtion for cell value ${cell}`);
  }
  return fn(board, index);
};

export default getPieceMoves;

export const test = {
  getPieceMovesFunctionByCell,
};
