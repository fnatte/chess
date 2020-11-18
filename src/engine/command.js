import { makeMove, nextTurn } from "./game";

export const moveCommand = (move) => (game) => makeMove(game, move);

/**
 * Invalid chess command really. Only used for debugging.
 */
export const passCommand = () => (game) => nextTurn(game);
