import createBoard from "./create-board";

describe("createBoard()", () => {
  it("should have length 64", () => {
    expect(createBoard()).toBeArrayOfSize(64);
  });

  it("should have a white rook at index 0", () => {
    const board = createBoard();
    expect(board[0]).toEqual(0x13);
  });

  it("should have a black rook at index 63", () => {
    const board = createBoard();
    expect(board[63]).toEqual(0x23);
  });

  it("should have a white pawn at index 8", () => {
    const board = createBoard();
    expect(board[8]).toEqual(0x16);
  });

  it("should have a black pawn at index 55", () => {
    const board = createBoard();
    expect(board[55]).toEqual(0x26);
  });

  it("should have a white queen at index 3", () => {
    const board = createBoard();
    expect(board[3]).toEqual(0x12);
  });

  it("should have a black queen at index 59", () => {
    const board = createBoard();
    expect(board[59]).toEqual(0x22);
  });
});
