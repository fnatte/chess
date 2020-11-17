import { san, sanBuildBoard } from "../san";
import getMoves from "./get-moves";

describe("getMoves", () => {
  it("should return pawn moves when given index of a pawn", () => {
    const board = sanBuildBoard("white P e5");
    expect(getMoves(board, san("e5"))).toIncludeMoves("e6");
  });
});
