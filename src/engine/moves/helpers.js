import { apply, curry, compose, flatten, map,
         allPass, pipe, ifElse, prop, complement,
         propSatisfies, assoc, evolve, inc, dec,
         always, add, subtract, last, converge, __,
         anyPass, identity, lift, concat, flip, is,
         until, append, when, juxt, equals, call } from 'ramda';

import {
  getCellColor,
  getCellPiece,
  getPieceName,
  isCellColor,
  isEmptyCell,
  isOpponent,
  isFriendly,
  isWhite,
  isBlack,
  getXFromIndex,
  getYFromIndex,
  getXYFromIndex,
  getIndexFromXY,
  isValidXY,
  isValidIndex,
} from '../utils';

// Helper functions
export const invalidate = always(-1);
export const isALane = pipe(getXFromIndex, equals(0));
export const isHLane = pipe(getXFromIndex, equals(7));
export const isSecondRank = pipe(getYFromIndex, equals(1));
export const isSeventhRank = pipe(getYFromIndex, equals(6));
export const isNotALane = complement(isALane);
export const isNotHLane = complement(isHLane);

// Index movers in form f(index) => index
export const moveIndexLeft = ifElse(allPass([isValidIndex, isNotALane]), dec, invalidate);
export const moveIndexRight = ifElse(allPass([isValidIndex, isNotHLane]), inc, invalidate);
export const moveIndexUp = ifElse(isValidIndex, add(8), invalidate);
export const moveIndexDown = ifElse(isValidIndex, subtract(__, 8), invalidate);
export const moveIndexUpLeft = pipe(moveIndexLeft, moveIndexUp);
export const moveIndexUpRight = pipe(moveIndexRight, moveIndexUp);
export const moveIndexDownLeft = pipe(moveIndexLeft, moveIndexDown);
export const moveIndexDownRight = pipe(moveIndexRight, moveIndexDown);

// State getters
export const getToCell = state => state.board[state.to];
export const getFromCell = state => state.board[state.from];
export const getLastMove = pipe(prop('moves'), last);
export const getLastMoveCell = state => state.board[getLastMove(state)];
export const getMyColor = pipe(getFromCell, getCellColor);

// Move state transformers
export const moveLeft = evolve({ to: moveIndexLeft });
export const moveRight = evolve({ to: moveIndexRight });
export const moveUp = evolve({ to: moveIndexUp });
export const moveDown = evolve({ to: moveIndexDown });
export const moveUpLeft = pipe(moveUp, moveLeft);
export const moveUpRight = pipe(moveUp, moveRight);
export const moveDownLeft = pipe(moveDown, moveLeft);
export const moveDownRight = pipe(moveDown, moveRight);

// Move colletions
export const diagonalMoves = [ moveUpLeft, moveUpRight, moveDownLeft, moveDownRight ];
export const straightMoves = [ moveLeft, moveRight, moveUp, moveDown ];
export const straightAndDiagonalMoves = straightMoves.concat(diagonalMoves);

// State predicates
export const limitF = curry((limiter, state) => (state.moves.length < limiter(state)));
export const limitN = n => limitF(always(n));
export const limitOne = limitN(1);

// State helpers
export const isValidState = pipe(prop('to'), isValidIndex);
export const isEmptyCellCond = pipe(getToCell, isEmptyCell);
export const isOpponentCond = converge(isOpponent, [getToCell, getMyColor]);
export const isFriendlyCond = converge(isFriendly, [getToCell, getMyColor]);
export const didCaptureCond = allPass([
    getLastMove,
    converge(isOpponent, [getLastMoveCell, getMyColor]),
]);
export const basicCond = complement(anyPass([didCaptureCond, isFriendlyCond]));

