import { san, sanBuildBoard } from "./san";
import { PieceColor, PieceType } from "./engine/constants";
import { cell } from "./engine/board";

describe("san()", () => {
  it("should parse index, color and piece", () => {
    expect(san("e2 white Q")).toEqual({
      index: 12,
      color: PieceColor.white,
      type: PieceType.queen,
    });
  });

  it("should parse only index", () => {
    expect(san("e2")).toEqual(12);
  });

  it("should parse multiple indices", () => {
    expect(san("e2 e3")).toEqual([12, 20]);
  });
  it("should parse color and piece", () => {
    expect(san("white P")).toEqual({
      color: PieceColor.white,
      type: PieceType.pawn,
    });
  });
});

describe("sanBuildBoard()", () => {
  it("should build board with single entry", () => {
    const board = sanBuildBoard("white P e2");
    expect(board).toHaveLength(64);
    expect(board[san("e2")]).toEqual(cell(PieceColor.white, PieceType.pawn));
  });
  it("should build board with two entries", () => {
    const board = sanBuildBoard("white Q e4, black K d2");
    expect(board).toHaveLength(64);
    expect(board[san("e4")]).toEqual(cell(PieceColor.white, PieceType.queen));
    expect(board[san("d2")]).toEqual(cell(PieceColor.black, PieceType.king));
  });
});
