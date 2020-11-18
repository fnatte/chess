/**
 * Move piece on board without checking any rules.
 *
 * @param {Array} board
 * @param {number} fromIndex
 * @param {number} toIndex
 *
 * @returns {Array} A board copy with the move applied.
 */
export default function movePiece(board, fromIndex, toIndex) {
  const newBoard = board.slice();
  newBoard[toIndex] = newBoard[fromIndex];
  newBoard[fromIndex] = 0;
  return newBoard;
}
