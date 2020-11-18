import { san, sanBuildBoard } from "../san";
import fen from "../fen";
import getMoves from "./get-moves";

describe("getMoves", () => {
  it("should return pawn moves when given index of a pawn", () => {
    const board = sanBuildBoard("white P e5");
    expect(getMoves(board, san("e5"))).toIncludeMoves("e6");
  });

  describe("check when moving the king", () => {
    it("should return no moves when only piece move options are in check", () => {
      const { board } = fen("3k4/8/8/8/8/8/r7/r2K4 w - - 0 1");
      expect(getMoves(board, san("d1"))).toBeArrayOfSize(0);
    });

    it("should return moves that are not in check", () => {
      const { board } = fen("3k4/8/8/8/5N2/8/r7/r4K2 b - - 0 1");
      expect(getMoves(board, san("f4"))).toBeArrayOfSize(0);
    });
  });

  describe("check when not moving the king", () => {
    it("should return no moves when king is in check", () => {
      const { board } = fen("3k4/8/8/8/5N2/8/r7/r4K2 b - - 0 1");
      expect(getMoves(board, san("f4"))).toBeArrayOfSize(0);
    });

    it("should return only move that breaks check", () => {
      const { board } = fen("3k4/8/8/8/8/5N2/r7/r4K2 b - - 0 1");
      expect(getMoves(board, san("f3"))).toIncludeMoves("e1");
    });

    it("should return all moves that breaks check", () => {
      const { board } = fen("3k4/8/8/8/8/4Q3/r7/r4K2 b - - 0 1");
      expect(getMoves(board, san("e3"))).toIncludeMoves("c1 e1");
    });
  });
});
