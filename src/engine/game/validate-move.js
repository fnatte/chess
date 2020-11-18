import { PieceType } from "../constants";
import { getMoves } from "../rules";
import { findBoardIndices } from "../board";
import {
  getCellValue,
  getXYFromSAN,
  getXYFromIndex,
  getIndexFromSAN,
  getPieceTypeFromSAN,
} from "../utils";

function distinguishIndex(index, dis) {
  if (dis === undefined) {
    return true;
  }

  const p1 = getXYFromIndex(index);
  const p2 = getXYFromSAN(dis);

  return (p2.x === -1 || p2.x === p1.x) && (p2.y === -1 || p2.y === p1.y);
}

export default function validateMove(game, sanMove) {
  const destIndex = getIndexFromSAN(sanMove.dest);

  // Find matching pieces
  const piece = getCellValue(
    getPieceTypeFromSAN(sanMove.piece) || PieceType.pawn,
    game.turn
  );

  const indices = findBoardIndices(
    game.board,
    (cell) => cell === piece
  ).filter((index) => distinguishIndex(index, sanMove.dis));

  // Determine which indices that can move to the destination
  const matchingIndices = indices.map((index) =>
    getMoves(game.board, index).includes(destIndex)
  );

  const matchingCount = matchingIndices.reduce((a, b) => {
    return b ? a + 1 : a;
  }, 0);

  if (matchingCount === 0) {
    return { error: "Move not available", matchingCount };
  }

  if (matchingCount > 1) {
    return { error: "Ambiguous move", matchingCount };
  }

  return {
    fromIndex: indices[matchingIndices.indexOf(true)],
    toIndex: destIndex,
  };
}
