import { emptyBoard, placePiece } from "../board";
import { san, sanBuildBoard } from "../san";
import { test } from "./move-getters";

const {
  getToCell,
  isEmptyCellCond,
  pawnMove,
  moveLeft,
  isFriendlyCond,
  getLastMove,
} = test;

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

describe("pawnMove()", () => {
  it("should move up white pieces", () => {
    const e4 = san("e4");
    const e5 = san("e5");
    const board = placePiece(emptyBoard(), san("e4 white P"));

    expect(pawnMove({ board, from: e4, to: e4 })).toHaveProperty("to", e5);
  });
  it("should move down black pieces", () => {
    const e4 = san("e4");
    const e3 = san("e3");
    const board = placePiece(emptyBoard(), san("e4 black P"));

    expect(pawnMove({ board, from: e4, to: e4 })).toHaveProperty("to", e3);
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
