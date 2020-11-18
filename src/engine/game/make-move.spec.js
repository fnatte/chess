import { parseMove } from "../san";
import makeMove from "./make-move";
import gameFromFen from "./game-from-fen";

describe("makeMove", () => {
  it("should set result to 0-1 on mate", () => {
    const game = gameFromFen("3k4/8/r7/8/8/8/1r6/5K2 b - - 0 1");
    const move = parseMove("Ra1");
    expect(makeMove(game, move).result).toBe("0-1");
  });

  it("should set result to 1-0 on mate", () => {
    const game = gameFromFen("3k4/8/8/8/4Q3/4R3/r6B/3K4 w - - 0 1");
    const move = parseMove("Qe8");
    expect(makeMove(game, move).result).toBe("1-0");
  });
});
