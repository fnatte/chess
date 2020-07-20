import { getColorFromSAN, getIndexFromSAN, getPieceTypeFromSAN } from "./utils";
import { emptyBoard, placePiece } from "./board";

const Piece = "([KQRBNP])";
const Pos = "([a-h][1-8])";
const Dis = "([a-h]|[1-8]|[a-h][1-8])";

const MoveRegExp = new RegExp(`^${Piece}?${Dis}?(x)?${Pos}$`);

export function parseMove(input) {
  const res = input.match(MoveRegExp);

  if (res === null) {
    return null;
  }

  return {
    piece: res[1] || "",
    dis: res[2],
    capture: res[3],
    dest: res[4],
  };
}

/* eslint-disable no-param-reassign */
function build(obj, propName, parseFunc, str) {
  const val = parseFunc(str);
  if (val !== null && val !== undefined && val !== -1) {
    if (typeof obj[propName] === "undefined") {
      obj[propName] = val;
      return;
    }

    if (Array.isArray(obj[propName])) {
      obj[propName].push(val);
      return;
    }

    obj[propName] = [obj[propName], val];
  }
}
/* eslint-enable no-param-reassign */

export function san(input) {
  const obj = input.split(" ").reduce((acc, str) => {
    build(acc, "color", getColorFromSAN, str);
    build(acc, "index", getIndexFromSAN, str);
    build(acc, "type", getPieceTypeFromSAN, str);
    return acc;
  }, {});

  const vals = Object.values(obj);
  return vals.length === 1 ? vals[0] : obj;
}

export function sanBuildBoard(input) {
  return input
    .split(",")
    .map(san)
    .reduce((board, o) => placePiece(board, o), emptyBoard());
}
