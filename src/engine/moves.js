import { PieceType, PieceColor, Direction } from './constants';
import {
  getCellColor,
  getCellPiece,
  isCellColor,
  isEmptyCell,
  isOpponent,
  isWhite,
  getXYFromIndex,
  getIndexFromXY,
  isValidXY,
  isValidIndex,
} from './utils';

import { getPawnMoves } from './moves/pawn';

const isALane = index => index % 8 === 0;
const isHLane = index => index % 8 === 7;

const moveLeft = index => (isValidIndex(index) && !isALane(index)) ? index - 1 : -1;
const moveRight = index => (isValidIndex(index) && !isHLane(index)) ? index + 1 : -1;
const moveUp = index => isValidIndex(index) ? index + 8 : -1;
const moveDown = index => isValidIndex(index) ? index - 8 : -1;
const moveUpLeft = index => moveUp(moveLeft(index));
const moveUpRight = index => moveUp(moveRight(index));
const moveDownLeft = index => moveDown(moveLeft(index));
const moveDownRight = index => moveDown(moveRight(index));

const diagonalMoves = [ moveUpLeft, moveUpRight, moveDownLeft, moveDownRight ];
const straightMoves = [ moveLeft, moveRight, moveUp, moveDown ];
const straightAndDiagonalMoves = straightMoves.concat(diagonalMoves);

const limitMove = (move, limit) => {
  let count = 0;
  return index => ++count <= limit ? move(index) : -1;
};
const limitMoves = (moves, limit) => moves.map(move => limitMove(move, limit));

function shouldAddMove(board, myColor, moves, index) {
  // Last move was capture
  if (moves.length > 0 && isOpponent(board[moves[moves.length - 1]], myColor)) {
    return false;
  }

  // Check bounds and make sure we don't go into own piece
  return isValidIndex(index) && !isCellColor(board[index], myColor);
}

function getMovesByMover(board, fromIndex, mover) {
  const moves = [];
  const myColor = getCellColor(board[fromIndex]);
  let index = mover(fromIndex);

  while (shouldAddMove(board, myColor, moves, index)) {
    moves.push(index);
    index = mover(index);
  }

  return moves;
}

const getMoves = (board, fromIndex) => (mover, condition) => {
  const moves = [];
  let index = mover(fromIndex);

  while (isValidIndex(index, board) && condition(fromIndex, index, board, moves)) {
    moves.push(index);
    index = mover(index);
  }

  return moves;
};

function getMovesByMovers(board, fromIndex, movers) {
  return movers.reduce((moves, mover) => (
      moves.concat(getMovesByMover(board, fromIndex, mover))
  ), []);
}

function isEmptyOrOpponent(board, fromIndex, toIndex) {
  const fromPiece = board[fromIndex];
  const toPiece = board[toIndex];

  return toPiece === 0 || fromPiece & 0xF0 === toPiece & 0xF0;
}

function getKnightMoves(board, index) {
  const { x, y } = getXYFromIndex(index);

  const moves = [
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
  ];

  return moves.filter(isValidXY)
    .map(getIndexFromXY)
    .filter(toIndex => isEmptyOrOpponent(board, index, toIndex));
}

const isOpponentInMove = (board, fromIndex, move) => {
  const color = getCellColor(board[fromIndex]);
  const toIndex = move(fromIndex);

  return isValidIndex(toIndex) && isOpponent(board[toIndex], color);
};

// function getPawnMoves(board, index) {
//   const { x, y } = getXYFromIndex(index);
//   const color = getCellColor(board[index]);
//   const moves = [];
//
//   // Forward move
//   moves.push(getIndexFromXY({
//     x,
//     y: color === PieceColor.white ? y + 1 : y - 1,
//   }));
//
//   // Double jump
//   if (color === PieceColor.white && y === 1) {
//     moves.push(getIndexFromXY({ x, y: 3 }));
//   } else if (color === PieceColor.black && y === 7) {
//     moves.push(getIndexFromXY({ x, y: 5 }));
//   }
//
//   // Capture
//   if (color === PieceColor.white) {
//     if (isOpponentInMove(board, index, moveUpLeft)) {
//       moves.push(moveUpLeft(index));
//     }
//     if (isOpponentInMove(board, index, moveUpRight)) {
//       moves.push(moveUpRight(index));
//     }
//   } else {
//     if (isOpponentInMove(board, index, moveUpLeft)) {
//       moves.push(moveUpLeft(index));
//     }
//     if (isOpponentInMove(board, index, moveUpRight)) {
//       moves.push(moveUpRight(index));
//     }
//
//   }
//
//   return moves
//     .filter(toIndex => isEmptyOrOpponent(board, index, toIndex));
// }
//
//

// const flatten = arr => arr.reduce((a, b) => a.concat(b), []);
// const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
// 
// const pawnMove = (index, board) => isWhite(board[index]) ?
//   moveUp(index) :
//   moveDown(index);
// const pawnCaptureLeftMove = compose(moveLeft, pawnMove);
// const pawnCaptureRightMove = compose(moveRight, pawnMove);
// 
// const isEmptyCellCond = (fromIndex, toIndex, board, moves) =>
//   isEmptyCell(board[toIndex]);
// 
// const isOpponentCond = (fromIndex, toIndex, board, moves) =>
//   isOpponent(board[toIndex], getCellColor(board[fromIndex]));
// 
// const pawn = [
//   [ pawnMove, isEmptyCell ],
//   [ pawnCaptureLeftMove, isOpponentCond ],
//   [ pawnCaptureRightMove, isOpponentCond ],
// ];
// 
// const pawner = moveResolver => flatten(pawn.map(x => moveResolver.apply(null, x)));
// const moveBuilder = moveDescriptions => (board, fromIndex) => {
//   const moveResolver = getMoves(board, fromIndex);
//   return flatten(moveDescriptions.map(...x => moveResolver(...x)));
// };
// 
// const moveBuider = moveDescriptions => compose(
// );
// 
// const getPawnMoves = compose(pawner, getMoves);
// 
// 
// const getPawnMoves = (board, fromIndex) => {
//   const m = getMoves(board, fromIndex);
//   return flatten([
//       m(pawnMove, isEmptyCellCond),
//       m(pawnCaptureLeftMove, isOpponentCond),
//       m(pawnCaptureRightMove, isOpponentCond),
//   ]);
// };

const getRookMoves = (board, fromIndex) =>
  getMovesByMovers(board, fromIndex, straightMoves);

const getBishopMoves = (board, fromIndex) =>
  getMovesByMovers(board, fromIndex, diagonalMoves);

const getQueenMoves = (board, fromIndex) =>
  getMovesByMovers(board, fromIndex, straightAndDiagonalMoves);

const getKingMoves = (board, fromIndex) =>
  getMovesByMovers(board, fromIndex, limitMoves(straightAndDiagonalMoves, 1));

const moveFunctions = {};
moveFunctions[PieceType.knight] = getKnightMoves;
moveFunctions[PieceType.pawn] = getPawnMoves;
moveFunctions[PieceType.rook] = getRookMoves;
moveFunctions[PieceType.bishop] = getBishopMoves;
moveFunctions[PieceType.queen] = getQueenMoves;
moveFunctions[PieceType.king] = getKingMoves;

export function getMoveFunction(cell) {
  return moveFunctions[getCellPiece(cell)];
}

