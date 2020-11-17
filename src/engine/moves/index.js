// TODO: remove test imports
import moveGetters, { test as moveGettersTest } from "./move-getters";
import { test as getMovesTest } from "./get-moves";

export const test = { ...moveGettersTest, ...getMovesTest };

export const getPawnMoves = moveGetters.pawn;
export const getRookMoves = moveGetters.rook;
export const getBishopMoves = moveGetters.bishop;
export const getQueenMoves = moveGetters.queen;
export const getKingMoves = moveGetters.king;
export const getKnightMoves = moveGetters.knight;

export { default as getMoves } from "./get-moves";
export { default as isCheckmate } from "./is-checkmate";
