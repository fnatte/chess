import { PieceColor, GameResult } from "../constants";
import { isCheckmate } from "../rules";
import { movePiece } from "../board";
import simplifySanMove from "./simplify-san-move";
import validateMove from "./validate-move";

function getWinnerFromColor(color) {
  return color === PieceColor.white
    ? GameResult.whiteWinner
    : GameResult.blackWinner;
}

export default function makeMove(game, sanMove) {
  const validationResult = validateMove(game, sanMove);
  if (validationResult.error) {
    return game;
  }

  const { fromIndex, toIndex } = validationResult;

  const board = movePiece(game.board, fromIndex, toIndex);

  // Change turn
  const turn =
    game.turn === PieceColor.white ? PieceColor.black : PieceColor.white;

  // Check for mate
  const result = isCheckmate(game.board, game.turn)
    ? getWinnerFromColor(game.turn)
    : null;

  return {
    ...game,
    board,
    turn,
    moves: [...game.moves, simplifySanMove(game, sanMove)],
    result,
  };
}
