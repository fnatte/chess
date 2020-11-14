import { san, sanBuildBoard, parseMove } from "./san";
import { PieceColor, PieceType } from "./constants";
import { getCellValue } from "./utils";

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
    expect(board[san("e2")]).toEqual(
      getCellValue(PieceColor.white, PieceType.pawn)
    );
  });
  it("should build board with two entries", () => {
    const board = sanBuildBoard("white Q e4, black K d2");
    expect(board).toHaveLength(64);
    expect(board[san("e4")]).toEqual(
      getCellValue(PieceColor.white, PieceType.queen)
    );
    expect(board[san("d2")]).toEqual(
      getCellValue(PieceColor.black, PieceType.king)
    );
  });
});

describe("parseMove()", () => {
  it("should parse Ra8", () => {
    expect(parseMove("Ra8")).toMatchObject({
      piece: "R",
      dest: "a8",
    });
  });
  it("should parse f4", () => {
    expect(parseMove("f4")).toMatchObject({
      piece: "",
      dest: "f4",
    });
  });
  it("should parse exd5", () => {
    expect(parseMove("exd5")).toMatchObject({
      piece: "",
      capture: "x",
      dest: "d5",
    });
  });
  it("should parse Qxb2", () => {
    expect(parseMove("Qxb2")).toMatchObject({
      piece: "Q",
      capture: "x",
      dest: "b2",
    });
  });
  it("should parse Rab2", () => {
    expect(parseMove("Rab2")).toMatchObject({
      piece: "R",
      dis: "a",
      dest: "b2",
    });
  });
  it("should parse R1a3", () => {
    expect(parseMove("R1a3")).toMatchObject({
      piece: "R",
      dis: "1",
      dest: "a3",
    });
  });
  it("should parse Qh4e1", () => {
    expect(parseMove("Qh4e1")).toMatchObject({
      piece: "Q",
      dis: "h4",
      dest: "e1",
    });
  });
  it("should parse Qh4xe1", () => {
    expect(parseMove("Qh4xe1")).toMatchObject({
      piece: "Q",
      dis: "h4",
      capture: "x",
      dest: "e1",
    });
  });
});
