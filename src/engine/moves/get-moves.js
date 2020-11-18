import { getCellColor } from "../utils";
import getPieceMoves from "./get-piece-moves";
import isCheck from "./is-check";

const getMoves = (board, index) => {
  const moves = getPieceMoves(board, index);

  return moves.filter((toIndex) => {
    // Make move on board copy
    const boardCopy = board.slice();
    boardCopy[toIndex] = boardCopy[index];
    boardCopy[index] = 0;

    // Test if player is in check after this move
    if (isCheck(boardCopy, getCellColor(board[index]))) {
      return false;
    }

    return true;
  });
};

export default getMoves;
