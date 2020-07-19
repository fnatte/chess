import { map } from "ramda";
import * as R from "ramda";

import { createBoard, emptyBoard, placePiece } from "../board";
import { PieceType, PieceColor } from "../constants";
import { getIndexFromSAN } from "../utils";
import { san, sanBuildBoard } from "../../san";
import {
  getPawnMoves,
  getRookMoves,
  getKnightMoves,
  getKingMoves,
  getBishopMoves,
  getQueenMoves,
  getMoves,
  test,
} from "./index";

const {
  getToCell,
  isEmptyCellCond,
  pawnMover,
  moveLeft,
  isFriendlyCond,
  getLastMove,
  knightMoves,
  getMovesFunctionByCell,
} = test;

function expectMoves(moves, arr) {
  expect(moves).toIncludeSameMembers(arr);
}

describe("moveLeft()", () => {
  it("shoud move to index of state left", () => {
    expect(moveLeft({ to: 10 })).toHaveProperty("to", 9);
  });
  it("shoud move to invalid index when on A lane", () => {
    expect(moveLeft({ to: 8 })).toHaveProperty("to", -1);
  });
});

describe("getToCell()", () => {
  it("should get the cell", () => {
    const state = { board: [1, 2, 3], from: 0, to: 1 };
    expect(getToCell(state)).toEqual(2);
  });
});

describe("isEmptyCellCond()", () => {
  it("should return true for empty cells", () => {
    const board = Array(10).fill(1);
    board[3] = 0;
    const state = { board, from: 0, to: 3 };
    expect(isEmptyCellCond(state)).toBe(true);
  });
  it("should return false for filled cells", () => {
    const board = Array(10).fill(1);
    const state = { board, from: 0, to: 3 };
    expect(isEmptyCellCond(state)).toBe(false);
  });
});

describe("pawnMover()", () => {
  it("should move up white pieces", () => {
    const e4 = san("e4");
    const e5 = san("e5");
    const board = placePiece(emptyBoard(), san("e4 white P"));

    expect(pawnMover({ board, from: e4, to: e4 })).toHaveProperty("to", e5);
  });
  it("should move down black pieces", () => {
    const e4 = san("e4");
    const e3 = san("e3");
    const board = placePiece(emptyBoard(), san("e4 black P"));

    expect(pawnMover({ board, from: e4, to: e4 })).toHaveProperty("to", e3);
  });
});

describe("getPawnMoves()", () => {
  it("should get white pawn moves on new board", () => {
    const board = createBoard();
    const moves = getPawnMoves(board, getIndexFromSAN("e2"));
    expect(moves).toEqual(map(getIndexFromSAN, ["e3", "e4"]));
  });
  it("should get black pawn moves on new board", () => {
    const board = createBoard();
    const moves = getPawnMoves(board, getIndexFromSAN("e7"));
    expect(moves).toEqual(map(getIndexFromSAN, ["e6", "e5"]));
  });
  it("should get white pawn moves when not new board", () => {
    const board = placePiece(emptyBoard(), san("e4 white P"));
    expect(getPawnMoves(board, san("e4"))).toEqual([san("e5")]);
  });
  it("should get white pawn capture moves", () => {
    let board = emptyBoard();
    board = placePiece(board, san("white P e4"));
    board = placePiece(board, san("black P d5"));
    board = placePiece(board, san("black P f5"));
    const moves = getPawnMoves(board, san("e4"));
    expect(moves).toContain(san("d5"));
    expect(moves).toContain(san("f5"));
  });
  it("should get both pawn capture and forward moves", () => {
    let board = emptyBoard();
    board = placePiece(board, san("white P e3"));
    board = placePiece(board, san("black Q f4"));
    expect(getPawnMoves(board, san("e3"))).toEqual(san("e4 f4"));
  });
  it("should not return any moves if blocked", () => {
    let board = emptyBoard();
    board = placePiece(board, san("black P e6"));
    board = placePiece(board, san("white P e5"));
    expect(getPawnMoves(board, san("e6"))).toHaveLength(0);
  });
});

describe("isFriendlyCond", () => {
  it("should return true when to has same color as from", () => {
    const board = sanBuildBoard("white P e2, white P e3");
    const state = { board, from: san("e2"), to: san("e3") };
    expect(isFriendlyCond(state)).toBe(true);
  });
  it("should return false when to opposite color of from", () => {
    const board = sanBuildBoard("white P e2, black P e3");
    const state = { board, from: san("e2"), to: san("e3") };
    expect(isFriendlyCond(state)).toBe(false);
  });
});

describe("getLastMove()", () => {
  it("should return the last move in state", () => {
    expect(getLastMove({ moves: [1, 2, 3] })).toEqual(3);
  });
});

describe("getRookMoves()", () => {
  it("should move in all directions", () => {
    let board = emptyBoard();
    board = placePiece(board, san("white R e4"));
    expectMoves(
      getRookMoves(board, san("e4")),
      san("e3 e2 e1 e5 e6 e7 e8 d4 c4 b4 a4 f4 g4 h4")
    );
  });
  it("should capture in all directions", () => {
    const board = sanBuildBoard(
      "white R e4, black P e2, black P e6, black P g4, black P c4"
    );
    expectMoves(getRookMoves(board, san("e4")), san("e3 e2 e5 e6 f4 g4 d4 c4"));
  });
  it("it should be blocked by friendly pieces", () => {
    let board = sanBuildBoard(
      "white R e2, white P e1, white P e3, white P d2, white P f2"
    );
    expect(getRookMoves(board, san("e2"))).toHaveLength(0);
  });
});

describe("getKingMoves()", () => {
  it("should move one step in all directions", () => {
    const board = sanBuildBoard("white K e4");
    expectMoves(getKingMoves(board, san("e4")), san("e5 e3 d4 f4"));
  });
  it("should be blocked by friendly pieces", () => {
    const board = sanBuildBoard("white K e4, white P e3");
    expectMoves(getKingMoves(board, san("e4")), san("e5 d4 f4"));
  });
});

describe("getKnightMoves()", () => {
  it("should follow the movement rules for a knight", () => {
    const board = sanBuildBoard("white N e5");
    expectMoves(
      getKnightMoves(board, san("e5")),
      san("d7 f7 g4 g6 c4 c6 d3 f3")
    );
  });
  it("should not be blocked by pieces", () => {
    const board = sanBuildBoard(
      "white N e5, white P d6, white P e6, white P f6, " +
        "white P d5, white P f5, white P d4, white P e4, white P f4"
    );
    expectMoves(
      getKnightMoves(board, san("e5")),
      san("d7 f7 g4 g6 c4 c6 d3 f3")
    );
  });
  it("should not move out of bounds", () => {
    const board = sanBuildBoard("white N a1");
    expectMoves(getKnightMoves(board, san("a1")), san("b3 c2"));
  });
  it("should capture opponent pieces", () => {
    const board = sanBuildBoard(
      "white N e5, black P d7, black P f7, black P g4, " +
        "black P g6, black P c4, black P c6, black P d3, black P f3"
    );
    expectMoves(
      getKnightMoves(board, san("e5")),
      san("d7 f7 g4 g6 c4 c6 d3 f3")
    );
  });
  it("should not capture friendly pieces", () => {
    const board = sanBuildBoard(
      "white N e5, white P d7, white P f7, white P g4, " +
        "white P g6, white P c4, white P c6, white P d3, white P f3"
    );
    expect(getKnightMoves(board, san("e5"))).toHaveLength(0);
  });
});

describe("getBishopMoves()", () => {
  it("should move diagonally", () => {
    const board = sanBuildBoard("white B d4");
    expectMoves(
      getBishopMoves(board, san("d4")),
      san("c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g7 g1 h8")
    );
  });

  it("should not be able to go through own pieces", () => {
    const board = sanBuildBoard("white B d4, white P b2");
    expectMoves(
      getBishopMoves(board, san("d4")),
      san("c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8")
    );
  });

  it("should be able to take enemy pieces (variant 1)", () => {
    const board = sanBuildBoard("white B d4, black P g7");
    expectMoves(
      getBishopMoves(board, san("d4")),
      san("c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g1 g7")
    );
  });

  it("should be able to take enemy pieces (variant 2)", () => {
    const board = sanBuildBoard("white B d4, black P c3");
    expectMoves(
      getBishopMoves(board, san("d4")),
      san("c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8")
    );
  });
});

describe("getQueenMoves()", () => {
  it("should move diagonally and straight", () => {
    const board = sanBuildBoard("white Q d4");
    const diagonals = "c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 d6 d7 d8 a4 b4 c4 e4 f4 g4 h4";
    expectMoves(
      getQueenMoves(board, san("d4")),
      san(`${diagonals} ${straights}`)
    );
  });

  it("should not be able to go through own pieces", () => {
    const board = sanBuildBoard("white Q d4, white P d6, white P b2");
    const diagonals = "c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 a4 b4 c4 e4 f4 g4 h4";
    expectMoves(
      getQueenMoves(board, san("d4")),
      san(`${diagonals} ${straights}`)
    );
  });

  it("should be able to take enemy pieces", () => {
    const board = sanBuildBoard("white Q d4, black P d6, black P b2");
    const diagonals = "b2 c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 d6 a4 b4 c4 e4 f4 g4 h4";
    expectMoves(
      getQueenMoves(board, san("d4")),
      san(`${diagonals} ${straights}`)
    );
  });
});

describe("getMovesFunctionByCell()", () => {
  it("should equal to getPawnMoves when moving pawn", () => {
    const board = sanBuildBoard("white P e5");
    expect(getMovesFunctionByCell(board[san("e5")])).toEqual(getPawnMoves);
  });
  it("should equal to getKingMoves when moving king", () => {
    const board = sanBuildBoard("white K e5");
    expect(getMovesFunctionByCell(board[san("e5")])).toEqual(getKingMoves);
  });
});

describe("getMoves()", () => {
  it("should have the same return value as getPawnMoves when moving pawn", () => {
    const board = sanBuildBoard("white P e2");
    const index = san("e2");
    expect(getMoves(board, index)).toEqual(getPawnMoves(board, index));
  });
});
