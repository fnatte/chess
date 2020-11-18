import { PieceColor, PieceType, GameResult } from "./constants";
import { getMoves, isCheckmate } from "./moves";
import { findBoardIndices, movePiece } from "./board";
import {
  getCellValue,
  getCellPiece,
  getXYFromSAN,
  getXYFromIndex,
  getIndexFromSAN,
  getPieceTypeFromSAN,
  getSANFromIndex,
  getSANPieceType,
  isEmptyCell,
} from "./utils";

function distinguishIndex(index, dis) {
  if (dis === undefined) {
    return true;
  }

  const p1 = getXYFromIndex(index);
  const p2 = getXYFromSAN(dis);

  return (p2.x === -1 || p2.x === p1.x) && (p2.y === -1 || p2.y === p1.y);
}

export function validateMove(game, sanMove) {
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

export function nextTurn(game) {
  return {
    ...game,
    turn: game.turn === PieceColor.white ? PieceColor.black : PieceColor.white,
  };
}

function simplifySanMove(game, sanMove) {
  const validationResult = validateMove(game, { ...sanMove, dis: undefined });

  return {
    piece: sanMove.piece !== "P" ? sanMove.piece : "",
    capture: sanMove.capture,
    dest: sanMove.dest,
    dis:
      validationResult.error && validationResult.matchingCount > 0
        ? sanMove.dis
        : undefined,
  };
}

function getWinnerFromColor(color) {
  return color === PieceColor.white
    ? GameResult.whiteWinner
    : GameResult.blackWinner;
}

export function makeMove(game, sanMove) {
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

export function createSanMove(game, indexMove) {
  const { fromIndex, toIndex } = indexMove;
  const sanMove = {
    piece: getSANPieceType(getCellPiece(game.board[fromIndex])),
    dis: getSANFromIndex(fromIndex),
    capture: isEmptyCell(game.board[toIndex]) ? "" : "x",
    dest: getSANFromIndex(toIndex),
  };

  return simplifySanMove(game, sanMove);
}
