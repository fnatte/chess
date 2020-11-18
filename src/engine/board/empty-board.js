import { PieceType } from "../constants";

export default function emptyBoard() {
  return Array(64).fill(PieceType.empty);
}
