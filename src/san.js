import { PieceType, PieceColor } from './engine/constants';
import { getIndexFromSAN, getPieceType } from './engine/utils';
import { emptyBoard, placePiece } from './engine/board';

const Piece = '([KQRBNP])';
const Pos = '([a-h][1-8])';
const Dis = '([a-h]|[1-8]|[a-h][1-8])';

const PieceRegExp = new RegExp(`^${Piece}$`);
const MoveRegExp = new RegExp(`^${Piece}?${Dis}?(x)?${Pos}$`);

export function parseMove(input) {
  const res = input.match(MoveRegExp);

  if (res === null) {
    return null;
  }

  return {
    piece: res[1] || '',
    dis: res[2],
    capture: res[3],
    dest: res[4],
  };
}

function parseColor(input) {
  if (input === 'white') {
    return PieceColor.white;
  }

  if (input === 'black') {
    return PieceColor.black;
  }

  return null;
}

function parsePieceType(input) {
  const res = input.match(PieceRegExp);
  return (res !== null ? getPieceType(res[1]) : null);
}

function build(obj, propName, parseFunc, str) {
  const val = parseFunc(str);
  if (val !== null && val !== -1) {
    if (typeof obj[propName] === 'undefined') {
      obj[propName] = val;
      return;
    }

    if (Array.isArray(obj[propName])) {
      obj[propName].push(val);
      return;
    }

    obj[propName] = [ obj[propName], val ];
  }

  return obj;
}

export function san(input) {
  const obj = input.split(' ').reduce((obj, str) => {
    build(obj, 'color', parseColor, str);
    build(obj, 'index', getIndexFromSAN, str);
    build(obj, 'type', parsePieceType, str);
    return obj;
  }, {});

  const vals = Object.values(obj);
  return vals.length === 1 ? vals[0] : obj;
}

export function sanBuildBoard(input) {
  return input.split(',')
    .map(san)
    .reduce((board, o) => placePiece(board, o), emptyBoard());
}

