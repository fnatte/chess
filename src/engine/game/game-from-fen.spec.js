import { PieceColor } from "../constants";
import gameFromFen from "./game-from-fen";

describe("gameFromFen", () => {
  it("should set turn to black", () => {
    expect(gameFromFen("3k4/8/r7/8/8/8/8/r4K2 b - - 0 1").turn).toBe(
      PieceColor.black
    );
  });
  it("should set turn to white", () => {
    expect(gameFromFen("3k4/8/r7/8/8/8/8/r4K2 w - - 0 1").turn).toBe(
      PieceColor.white
    );
  });
});
