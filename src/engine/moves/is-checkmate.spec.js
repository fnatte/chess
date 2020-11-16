import { PieceColor } from "../constants";
import fen from "../fen";
import { createBoard } from "../board";
import isCheckmate from "./is-checkmate";

describe("isCheckmate", () => {
  describe("given initial board", () => {
    it("should return false for white", () => {
      expect(isCheckmate(createBoard(), PieceColor.white)).toBe(false);
    });
    it("should return false for black", () => {
      expect(isCheckmate(createBoard(), PieceColor.black)).toBe(false);
    });
  });

  it("should find black is not in check", () => {
    const { board } = fen(
      "rnbqk1nr/ppp1bppp/4p3/1Q1p4/3P4/8/PPP1PPPP/RNB1KBNR b KQkq - 0 1"
    );
    expect(isCheckmate(board, PieceColor.black)).toBe(false);
  });

  it("should find white is not in check", () => {
    const { board } = fen(
      "rnb1k1nr/pppq1ppp/4p3/1Q1p4/1b1P4/8/PPP1PPPP/RNB1KBNR w KQkq - 0 1"
    );
    expect(isCheckmate(board, PieceColor.white)).toBe(false);
  });

  it("should find white is in check", () => {
    const { board } = fen("3k4/8/8/8/8/8/r7/r2K4 w - - 0 1");
    expect(isCheckmate(board, PieceColor.white)).toBe(true);
  });
});
