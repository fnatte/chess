import { getMoves, makeMove } from './chess';
import { findBoardIndices } from './board';
import { isCellColor } from './utils';
import { moveCommand, passCommand } from './command';

export function AI(game, color) {
  // Find random move (best case very good AI)
  const indices = findBoardIndices(game.board, cell => isCellColor(cell, color));
  const moves = indices.reduce((moves, fromIndex) => (
          moves.concat(
            getMoves(game.board, fromIndex).map(toIndex => ({ fromIndex, toIndex }))
          )
  ), []);

  if (moves.length > 0) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return moveCommand(randomMove.fromIndex, randomMove.toIndex);
  }

  return passCommand();
}
