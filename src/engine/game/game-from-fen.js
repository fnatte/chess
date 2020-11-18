import fen from "../fen";

export default function gameFromFen(input) {
  const { board, turn } = fen(input);

  return {
    board,
    turn,
    moves: [],
    winner: null,
  };
}
