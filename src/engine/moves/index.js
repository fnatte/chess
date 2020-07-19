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

import {
  getFromCell,
  getToCell,
  getLastMove,
  moveIndexUp,
  moveIndexDown,
  moveIndexLeft,
  moveIndexRight,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  isEmptyCellCond,
  isOpponentCond,
  isValidState,
  isFriendlyCond,
  isSecondRank,
  isSeventhRank,
  limitF,
  limitOne,
  straightMoves,
  diagonalMoves,
  straightAndDiagonalMoves,
  basicCond,
} from './helpers';

// Build knight move indexes by taking piping the same move twice,
// followed by another move in a lift (which will make all combinations).
const knightLift = lift((f, g) => pipe(f, f, g));
const knightCoverger = converge(concat, [knightLift, flip(knightLift)]);
const moveIndicesKnight = knightCoverger(
    [moveIndexUp, moveIndexDown],
    [moveIndexLeft, moveIndexRight],
);

const knightMoves = moveIndicesKnight.map(move => evolve({ to: move }));

const pawnMover = ifElse(
    pipe(getFromCell, isWhite),
    moveUp,
    moveDown,
);

// Returns 1 if the pawn has moved, otherwise it returns 2.
const pawnLimit = state =>
  ((isWhite(getFromCell(state)) && isSecondRank(state.from)) ||
   (isBlack(getFromCell(state)) && isSeventhRank(state.from))) ? 2 : 1;


// Helper functions used in buildMoves().
const saveMove = state => assoc('moves', append(state.to, state.moves), state);
const emptyState = (board, from) => ({ board, from, to: from, moves: [] });

// Function to build a list of move indices using a iterator and predicate.
// It will keep calling the iterator as long as the predicate returns true,
// and add a move index each iteration.
const buildMoves = (fn, pred) => pipe(
    emptyState,
    fn,
    until(
      complement(allPass([ isValidState, pred ])),
      pipe(saveMove, fn),
    ),
    prop('moves'),
);

// Function used to build a movement getter function, fn(board, index), from
// a list of movement descriptors.
const buildMovesGetter = descs => pipe(juxt(map(apply(buildMoves), descs)), flatten);

// Movement descriptions for all pieces.
const moveDescriptions = {
  pawn: [
    [ pawnMover, allPass([ isEmptyCellCond, limitF(pawnLimit)]) ],
    [ pipe(pawnMover, moveLeft), allPass([ isOpponentCond, limitOne ]) ],
    [ pipe(pawnMover, moveRight), allPass([ isOpponentCond, limitOne ]) ],
  ],
  rook: straightMoves.map(move => [ move, basicCond ]),
  bishop: diagonalMoves.map(move => [ move, basicCond ]),
  queen: straightAndDiagonalMoves.map(move => [ move, basicCond ]),
  king: straightMoves.map(move => [ move, allPass([ basicCond, limitOne ]) ]),
  knight: knightMoves.map(move => [ move, allPass([ basicCond, limitOne ]) ]),
};

const moveGetters = map(buildMovesGetter, moveDescriptions);

const getMovesFunctionByCell = pipe(
  getCellPiece, getPieceName, prop(__, moveGetters)
);

// export const getMoves = (board, index) =>
//     pipe(prop(index, board), getMovesFunctionByCell)(board, index);

export const getMoves = (board, index) =>
  getMovesFunctionByCell(board[index])(board, index);

/*
export const getMoves = converge(
  call,
  pipe(flip(prop), getMovesFunctionByCell),
  identity,
);
*/

// const getMoves = (board, index) => {
//   return moveGetters[getPieceName(board[index])](board, index);
// };

export const getPawnMoves = moveGetters.pawn;
export const getRookMoves = moveGetters.rook;
export const getBishopMoves = moveGetters.bishop;
export const getQueenMoves = moveGetters.queen;
export const getKingMoves = moveGetters.king;
export const getKnightMoves = moveGetters.knight;

export const test = {
  moveLeft,
  isEmptyCellCond,
  pawnMover,
  getToCell,
  isFriendlyCond,
  getLastMove,
  knightMoves,
  getMovesFunctionByCell,
};

