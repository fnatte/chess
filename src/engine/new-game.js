import { createBoard } from "./board";
import { PieceColor } from "./constants";

export default function newGame() {
  return {
    board: createBoard(),
    turn: PieceColor.white,
    moves: [],
  };
}
