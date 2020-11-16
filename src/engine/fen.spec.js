import parse from "./fen";
import { PieceColor } from "./constants";

describe("fen parse", () => {
  it("should parse piece placement of starting position", () => {
    const result = parse(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
    // prettier-ignore
    expect(result).toMatchObject({
        board: [
          19, 21, 20, 18, 17, 20, 21, 19,
          22, 22, 22, 22, 22, 22, 22, 22,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
          38, 38, 38, 38, 38, 38, 38, 38,
          35, 37, 36, 34, 33, 36, 37, 35,
        ]
      });
  });

  it("should parse turn of starting position", () => {
    const result = parse(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
    expect(result).toMatchObject({ turn: PieceColor.white });
  });

  it("should parse piece placement after 1.e4", () => {
    const result = parse(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    );
    // prettier-ignore
    expect(result).toMatchObject({
        board: [
          19, 21, 20, 18, 17, 20, 21, 19,
          22, 22, 22, 22,  0, 22, 22, 22,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0, 22,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
          38, 38, 38, 38, 38, 38, 38, 38,
          35, 37, 36, 34, 33, 36, 37, 35,
        ]
      });
  });

  it("should parse piece placement after 1.e4 c5", () => {
    const result = parse(
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
    );
    // prettier-ignore
    expect(result).toMatchObject({
        board: [
          19, 21, 20, 18, 17, 20, 21, 19,
          22, 22, 22, 22,  0, 22, 22, 22,
           0,  0,  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0, 22,  0,  0,  0,
           0,  0, 38,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
          38, 38,  0, 38, 38, 38, 38, 38,
          35, 37, 36, 34, 33, 36, 37, 35,
        ]
      });
  });

  it("should parse piece placement after 1.e4 c5 2.Nf3", () => {
    const result = parse(
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
    );
    // prettier-ignore
    expect(result).toMatchObject({
        board: [
          19, 21, 20, 18, 17, 20,  0, 19,
          22, 22, 22, 22,  0, 22, 22, 22,
           0,  0,  0,  0,  0, 21,  0,  0,
           0,  0,  0,  0, 22,  0,  0,  0,
           0,  0, 38,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0,  0,
          38, 38,  0, 38, 38, 38, 38, 38,
          35, 37, 36, 34, 33, 36, 37, 35,
        ]
      });
  });

  it("should parse complete string", () => {
    const result = parse("5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8 b - - 1 32");
    // prettier-ignore
    expect(result).toMatchObject({
        board: [
           0,  0,  0,  0,  0,  0,  0,  0,
          22, 22,  0,  0,  0, 22,  0,  0,
           0, 17,  0,  0, 21, 35,  0,  0,
           0,  0,  0,  0,  0,  0, 22,  0,
           0,  0,  0, 19,  0,  0,  0, 38,
           0,  0,  0,  0, 22,  0,  0,  0,
          38, 38, 38,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0, 33,  0,  0,
        ]
      });
  });
});
