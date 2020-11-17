import { pipe, prop, __ } from "ramda";
import { getCellPiece, getPieceName } from "../utils";
import moveGetters from "./move-getters";

const getMovesFunctionByCell = pipe(
  getCellPiece,
  getPieceName,
  prop(__, moveGetters)
);

const getMoves = (board, index) =>
  getMovesFunctionByCell(board[index])(board, index);

export default getMoves;

export const test = {
  getMovesFunctionByCell,
};
