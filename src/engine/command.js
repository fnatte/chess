import { makeMove, nextTurn } from "./chess";

export const moveCommand = (fromIndex, toIndex) => (game) =>
  makeMove(game, fromIndex, toIndex);

/**
 * Invalid chess command really. Only used for debugging.
 */
export const passCommand = () => (game) => nextTurn(game);
