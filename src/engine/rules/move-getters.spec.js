import { map } from "ramda";
import { san, sanBuildBoard } from "../san";
import { createBoard, emptyBoard, placePiece } from "../board";
import { getIndexFromSAN } from "../utils";
import {
  getPawnMoves,
  getRookMoves,
  getBishopMoves,
  getKingMoves,
  getQueenMoves,
  getKnightMoves,
} from "./move-getters";

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

describe("getRookMoves()", () => {
  it("should move in all directions", () => {
    let board = emptyBoard();
    board = placePiece(board, san("white R e4"));
    expect(getRookMoves(board, san("e4"))).toIncludeMoves(
      "e3 e2 e1 e5 e6 e7 e8 d4 c4 b4 a4 f4 g4 h4"
    );
  });
  it("should capture in all directions", () => {
    const board = sanBuildBoard(
      "white R e4, black P e2, black P e6, black P g4, black P c4"
    );
    expect(getRookMoves(board, san("e4"))).toIncludeMoves(
      "e3 e2 e5 e6 f4 g4 d4 c4"
    );
  });
  it("it should be blocked by friendly pieces", () => {
    const board = sanBuildBoard(
      "white R e2, white P e1, white P e3, white P d2, white P f2"
    );
    expect(getRookMoves(board, san("e2"))).toHaveLength(0);
  });
});

describe("getKingMoves()", () => {
  it("should move one step in all directions", () => {
    const board = sanBuildBoard("white K e4");
    expect(getKingMoves(board, san("e4"))).toIncludeMoves("e5 e3 d4 f4");
  });
  it("should be blocked by friendly pieces", () => {
    const board = sanBuildBoard("white K e4, white P e3");
    expect(getKingMoves(board, san("e4"))).toIncludeMoves("e5 d4 f4");
  });
});

describe("getKnightMoves()", () => {
  it("should follow the movement rules for a knight", () => {
    const board = sanBuildBoard("white N e5");
    expect(getKnightMoves(board, san("e5"))).toIncludeMoves(
      "d7 f7 g4 g6 c4 c6 d3 f3"
    );
  });
  it("should not be blocked by pieces", () => {
    const board = sanBuildBoard(
      "white N e5, white P d6, white P e6, white P f6, " +
        "white P d5, white P f5, white P d4, white P e4, white P f4"
    );
    expect(getKnightMoves(board, san("e5"))).toIncludeMoves(
      "d7 f7 g4 g6 c4 c6 d3 f3"
    );
  });
  it("should not move out of bounds", () => {
    const board = sanBuildBoard("white N a1");
    expect(getKnightMoves(board, san("a1"))).toIncludeMoves("b3 c2");
  });
  it("should capture opponent pieces", () => {
    const board = sanBuildBoard(
      "white N e5, black P d7, black P f7, black P g4, " +
        "black P g6, black P c4, black P c6, black P d3, black P f3"
    );
    expect(getKnightMoves(board, san("e5"))).toIncludeMoves(
      "d7 f7 g4 g6 c4 c6 d3 f3"
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
    expect(getBishopMoves(board, san("d4"))).toIncludeMoves(
      "c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g7 g1 h8"
    );
  });

  it("should not be able to go through own pieces", () => {
    const board = sanBuildBoard("white B d4, white P b2");
    expect(getBishopMoves(board, san("d4"))).toIncludeMoves(
      "c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8"
    );
  });

  it("should be able to take enemy pieces (variant 1)", () => {
    const board = sanBuildBoard("white B d4, black P g7");
    expect(getBishopMoves(board, san("d4"))).toIncludeMoves(
      "c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g1 g7"
    );
  });

  it("should be able to take enemy pieces (variant 2)", () => {
    const board = sanBuildBoard("white B d4, black P c3");
    expect(getBishopMoves(board, san("d4"))).toIncludeMoves(
      "c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8"
    );
  });
});

describe("getQueenMoves()", () => {
  it("should move diagonally and straight", () => {
    const board = sanBuildBoard("white Q d4");
    const diagonals = "c3 c5 b2 b6 a1 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 d6 d7 d8 a4 b4 c4 e4 f4 g4 h4";
    expect(getQueenMoves(board, san("d4"))).toIncludeMoves(
      `${diagonals} ${straights}`
    );
  });

  it("should not be able to go through own pieces", () => {
    const board = sanBuildBoard("white Q d4, white P d6, white P b2");
    const diagonals = "c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 a4 b4 c4 e4 f4 g4 h4";
    expect(getQueenMoves(board, san("d4"))).toIncludeMoves(
      `${diagonals} ${straights}`
    );
  });

  it("should be able to take enemy pieces", () => {
    const board = sanBuildBoard("white Q d4, black P d6, black P b2");
    const diagonals = "b2 c3 c5 b6 a7 e5 e3 f6 f2 g7 g1 h8";
    const straights = "d1 d2 d3 d5 d6 a4 b4 c4 e4 f4 g4 h4";
    expect(getQueenMoves(board, san("d4"))).toIncludeMoves(
      `${diagonals} ${straights}`
    );
  });
});
