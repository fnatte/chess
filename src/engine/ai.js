import { getMoves } from "./moves";
import { findBoardIndices } from "./board";
import {
  isCellColor,
  getSANFromIndex,
  getCellPiece,
  getSANPieceType,
  isEmptyCell,
} from "./utils";
import { moveCommand, passCommand } from "./command";

function indicesToMove(board, fromIndex, toIndex) {
  return {
    piece: getSANPieceType(getCellPiece(board[fromIndex])),
    dis: getSANFromIndex(fromIndex),
    capture: isEmptyCell(board[toIndex]) ? "" : "x",
    dest: getSANFromIndex(toIndex),
  };
}

export default function AI(game, color) {
  // Find random move (best case very good AI)
  const indices = findBoardIndices(game.board, (cell) =>
    isCellColor(cell, color)
  );
  const moves = indices.reduce(
    (acc, fromIndex) =>
      acc.concat(
        getMoves(game.board, fromIndex).map((toIndex) =>
          indicesToMove(game.board, fromIndex, toIndex)
        )
      ),
    []
  );

  if (moves.length > 0) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return moveCommand(randomMove);
  }

  return passCommand();
}
