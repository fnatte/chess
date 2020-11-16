import { PieceColor } from "./constants";
import { getCellValue, getPieceTypeFromSAN } from "./utils";
import { emptyBoard } from "./board";

function isDigit(ch) {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ch.charCodeAt(0) >= 48 &&
    ch.charCodeAt(0) <= 57
  );
}

function parsePiecePlacement(acc, ch) {
  if (ch === "/") {
    acc.idx -= 16;
    return acc;
  }

  if (isDigit(ch)) {
    const skip = parseInt(ch, 10);
    if (skip > 8) {
      throw Error("Can not skip more than 8 squares");
    }
    acc.idx += skip;
    return acc;
  }

  acc.result.board[acc.idx] = getCellValue(
    getPieceTypeFromSAN(ch.toUpperCase()),
    ch === ch.toUpperCase() ? PieceColor.white : PieceColor.black
  );
  acc.idx += 1;
  return acc;
}

function parseTurn(acc, ch) {
  switch (ch) {
    case "w":
      acc.result.turn = PieceColor.white;
      break;
    case "b":
      acc.result.turn = PieceColor.black;
      break;
    default:
      throw new Error("Failed to parse turn (active color)");
  }
  return acc;
}

export default function parse(input) {
  const { result } = Array.from(input).reduce(
    (acc, ch) => {
      if (ch === " ") {
        acc.fieldIndex += 1;
        return acc;
      }

      switch (acc.fieldIndex) {
        case 0:
          return parsePiecePlacement(acc, ch);
        case 1:
          return parseTurn(acc, ch);
        default:
          return acc;
      }
    },
    {
      result: {
        board: emptyBoard(),
        turn: null,
        castlingAvailability: null,
        enPessantTargetSquare: null,
        halfMoveClock: null,
        fullMoveNumber: null,
      },
      idx: 56,
      fieldIndex: 0,
    }
  );

  return result;
}
