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
} from './utils';

// Helper functions
const invalidate = always(-1);
const isALane = pipe(getXFromIndex, equals(0));
const isHLane = pipe(getXFromIndex, equals(7));
const isSecondRank = pipe(getYFromIndex, equals(1));
const isSeventhRank = pipe(getYFromIndex, equals(6));
const isNotALane = complement(isALane);
const isNotHLane = complement(isHLane);

// Index movers in form f(index) => index
const moveIndexLeft = ifElse(allPass([isValidIndex, isNotALane]), dec, invalidate);
const moveIndexRight = ifElse(allPass([isValidIndex, isNotHLane]), inc, invalidate);
const moveIndexUp = ifElse(isValidIndex, add(8), invalidate);
const moveIndexDown = ifElse(isValidIndex, subtract(__, 8), invalidate);
const moveIndexUpLeft = pipe(moveIndexLeft, moveIndexUp);
const moveIndexUpRight = pipe(moveIndexRight, moveIndexUp);
const moveIndexDownLeft = pipe(moveIndexLeft, moveIndexDown);
const moveIndexDownRight = pipe(moveIndexRight, moveIndexDown);

// Build knight move indexes by taking piping the same move twice,
// followed by another move in a lift (which will make all combinations).
const knightLift = lift((f, g) => pipe(f, f, g));
const knightCoverger = converge(concat, [knightLift, flip(knightLift)]);
const moveIndicesKnight = knightCoverger(
    [moveIndexUp, moveIndexDown],
    [moveIndexLeft, moveIndexRight],
);

// State helpers
const getToCell = state => state.board[state.to];
const getFromCell = state => state.board[state.from];
const getLastMove = pipe(prop('moves'), last);
const getLastMoveCell = state => state.board[getLastMove(state)];
const getMyColor = pipe(getFromCell, getCellColor);


// State transformers
const moveLeft = evolve({ to: moveIndexLeft });
const moveRight = evolve({ to: moveIndexRight });
const moveUp = evolve({ to: moveIndexUp });
const moveDown = evolve({ to: moveIndexDown });
const moveUpLeft = pipe(moveUp, moveLeft);
const moveUpRight = pipe(moveUp, moveRight);
const moveDownLeft = pipe(moveDown, moveLeft);
const moveDownRight = pipe(moveDown, moveRight);

const knightMoves = moveIndicesKnight.map(move => evolve({ to: move }));

const diagonalMoves = [ moveUpLeft, moveUpRight, moveDownLeft, moveDownRight ];
const straightMoves = [ moveLeft, moveRight, moveUp, moveDown ];
const straightAndDiagonalMoves = straightMoves.concat(diagonalMoves);

const pawnMover = ifElse(
    pipe(getFromCell, isWhite),
    moveUp,
    moveDown,
);

// Returns 1 if the pawn has moved, otherwise it returns 2.
const pawnLimit = state =>
  ((isWhite(getFromCell(state)) && isSecondRank(state.from)) ||
   (isBlack(getFromCell(state)) && isSeventhRank(state.from))) ? 2 : 1;

// State predicates
const limitF = curry((limiter, state) => (state.moves.length < limiter(state)));
const limitN = n => limitF(always(n));
const limitOne = limitN(1);

const isValidState = pipe(prop('to'), isValidIndex);
const isEmptyCellCond = pipe(getToCell, isEmptyCell);
const isOpponentCond = converge(isOpponent, [getToCell, getMyColor]);
const isFriendlyCond = converge(isFriendly, [getToCell, getMyColor]);
const didCaptureCond = allPass([
    getLastMove,
    converge(isOpponent, [getLastMoveCell, getMyColor]),
]);
const basicCond = complement(anyPass([didCaptureCond, isFriendlyCond]));


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

