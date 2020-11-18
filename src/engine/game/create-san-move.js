import {
  getCellPiece,
  getSANFromIndex,
  getSANPieceType,
  isEmptyCell,
} from "../utils";
import simplifySanMove from "./simplify-san-move";

export default function createSanMove(game, indexMove) {
  const { fromIndex, toIndex } = indexMove;
  const sanMove = {
    piece: getSANPieceType(getCellPiece(game.board[fromIndex])),
    dis: getSANFromIndex(fromIndex),
    capture: isEmptyCell(game.board[toIndex]) ? "" : "x",
    dest: getSANFromIndex(toIndex),
  };

  return simplifySanMove(game, sanMove);
}
