import { makeMove, nextTurn } from "./chess";

export const moveCommand = (move) => (game) => makeMove(game, move);

/**
 * Invalid chess command really. Only used for debugging.
 */
export const passCommand = () => (game) => nextTurn(game);
