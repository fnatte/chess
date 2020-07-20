import { getColorFromSAN, getPieceTypeFromSAN } from "./utils";
import { PieceColor, PieceType } from "./constants";

describe("getColorFromSAN()", () => {
  it("should parse white", () => {
    expect(getColorFromSAN("white")).toEqual(PieceColor.white);
  });

  it("should parse black", () => {
    expect(getColorFromSAN("black")).toEqual(PieceColor.black);
  });

  it("should return undefined for unknown color values", () => {
    expect(getColorFromSAN("blue")).toBeUndefined();
  });
});

describe("getPieceTypeFromSAN()", () => {
  it("should parse P as pawn", () => {
    expect(getPieceTypeFromSAN("P")).toEqual(PieceType.pawn);
  });

  it("should parse Q as queen", () => {
    expect(getPieceTypeFromSAN("Q")).toEqual(PieceType.queen);
  });

  it("should parse R as rook", () => {
    expect(getPieceTypeFromSAN("R")).toEqual(PieceType.rook);
  });

  it("should parse B as bishop", () => {
    expect(getPieceTypeFromSAN("B")).toEqual(PieceType.bishop);
  });

  it("should parse N as knight", () => {
    expect(getPieceTypeFromSAN("N")).toEqual(PieceType.knight);
  });

  it("should parse K as king", () => {
    expect(getPieceTypeFromSAN("K")).toEqual(PieceType.king);
  });

  it("should return undefined for unknown color values", () => {
    expect(getPieceTypeFromSAN("A")).toBeUndefined();
  });
});
