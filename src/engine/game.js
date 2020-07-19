import { createBoard } from "./board";
import { PieceColor } from "./constants";

export function newGame() {
  return {
    board: createBoard(),
    turn: PieceColor.white,
  };
}
