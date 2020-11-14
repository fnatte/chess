import { getMoves } from "./moves";
import { findBoardIndices } from "./board";
import { isCellColor, getSANFromIndex } from "./utils";
import { moveCommand, passCommand } from "./command";

function indicesToMove(fromIndex, toIndex) {
  return {
    piece: "",
    dis: getSANFromIndex(fromIndex),
    capture: undefined,
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
          indicesToMove(fromIndex, toIndex)
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
