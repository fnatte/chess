import { PieceColor } from "../constants";
import fen from "../fen";
import { createBoard } from "../board";
import isCheck from "./is-check";

describe("isCheck", () => {
  describe("given initial board", () => {
    it("should return false for white", () => {
      expect(isCheck(createBoard(), PieceColor.white)).toBe(false);
    });
    it("should return false for black", () => {
      expect(isCheck(createBoard(), PieceColor.black)).toBe(false);
    });
  });

  it("should find black in check", () => {
    const { board } = fen(
      "rnbqk1nr/ppp1bppp/4p3/1Q1p4/3P4/8/PPP1PPPP/RNB1KBNR b KQkq - 0 1"
    );
    expect(isCheck(board, PieceColor.black)).toBe(true);
  });
  it("should find white in check", () => {
    const { board } = fen(
      "rnb1k1nr/pppq1ppp/4p3/1Q1p4/1b1P4/8/PPP1PPPP/RNB1KBNR w KQkq - 0 1"
    );
    expect(isCheck(board, PieceColor.white)).toBe(true);
  });
});
