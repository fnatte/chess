import { PieceColor } from "../constants";

export default function nextTurn(game) {
  return {
    ...game,
    turn: game.turn === PieceColor.white ? PieceColor.black : PieceColor.white,
  };
}
