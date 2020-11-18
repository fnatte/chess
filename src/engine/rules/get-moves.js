import { getCellColor } from "../utils";
import { movePiece } from "../board";
import getPieceMoves from "./get-piece-moves";
import isCheck from "./is-check";

const getMoves = (board, index) => {
  const moves = getPieceMoves(board, index);

  return moves.filter((toIndex) => {
    const boardCopy = movePiece(board, index, toIndex);

    // Test if player is in check after this move
    if (isCheck(boardCopy, getCellColor(board[index]))) {
      return false;
    }

    return true;
  });
};

export default getMoves;
