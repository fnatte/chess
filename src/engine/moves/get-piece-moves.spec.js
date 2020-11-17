import { san, sanBuildBoard } from "../san";
import getPieceMoves, { test } from "./get-piece-moves";
import { getPawnMoves, getKingMoves } from "./move-getters";

const { getPieceMovesFunctionByCell } = test;

describe("getPieceMovesFunctionByCell()", () => {
  it("should equal to getPawnMoves when moving pawn", () => {
    const board = sanBuildBoard("white P e5");
    expect(getPieceMovesFunctionByCell(board[san("e5")])).toEqual(getPawnMoves);
  });
  it("should equal to getKingMoves when moving king", () => {
    const board = sanBuildBoard("white K e5");
    expect(getPieceMovesFunctionByCell(board[san("e5")])).toEqual(getKingMoves);
  });
});

describe("getPieceMoves()", () => {
  it("should have the same return value as getPawnMoves when moving pawn", () => {
    const board = sanBuildBoard("white P e2");
    const index = san("e2");
    expect(getPieceMoves(board, index)).toEqual(getPawnMoves(board, index));
  });
});
