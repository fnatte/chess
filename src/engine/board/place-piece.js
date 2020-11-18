import { getCellValue } from "../utils";

export default function placePiece(board, desc) {
  const newBoard = board.slice();
  newBoard[desc.index] = getCellValue(desc.type, desc.color);

  return newBoard;
}
