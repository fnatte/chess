import { getMoves } from "./rules";
import { findBoardIndices } from "./board";
import { createSanMove } from "./chess";
import { isCellColor } from "./utils";
import { moveCommand, passCommand } from "./command";

export default function AI(game, color) {
  // Find random move (best case very good AI)
  const indices = findBoardIndices(game.board, (cell) =>
    isCellColor(cell, color)
  );
  const moves = indices.reduce(
    (acc, fromIndex) =>
      acc.concat(
        getMoves(game.board, fromIndex).map((toIndex) =>
          createSanMove(game, { fromIndex, toIndex })
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
