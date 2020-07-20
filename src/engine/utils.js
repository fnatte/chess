import { PieceColor, PieceNames } from "./constants";

/**
 * Cell utils
 */

/* eslint-disable no-bitwise */

export function getCellColor(cell) {
  return cell & 0xf0;
}

export function getCellPiece(cell) {
  return cell & 0x0f;
}

/* eslint-enable no-bitwise */

export function getColorName(color) {
  return color === PieceColor.white ? "white" : "black";
}

export function getPieceName(pieceType) {
  return PieceNames[pieceType];
}

export function isCellColor(cell, color) {
  return getCellColor(cell) === color;
}

export function isWhite(cell) {
  return getCellColor(cell) === PieceColor.white;
}

export function isBlack(cell) {
  return getCellColor(cell) === PieceColor.black;
}

export function isEmptyCell(cell) {
  return cell === 0;
}

export function isOpponent(cell, myColor) {
  return !isEmptyCell(cell) && !isCellColor(cell, myColor);
}

export function isFriendly(cell, myColor) {
  return !isEmptyCell(cell) && isCellColor(cell, myColor);
}

/**
 * Index/position utils
 */

export function isValidIndex(index) {
  return index >= 0 && index < 64;
}

export function isValidXY({ x, y }) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

export const getXFromIndex = (index) => index % 8;
export const getYFromIndex = (index) => Math.floor(index / 8);
export const getXYFromIndex = (index) => ({
  x: getXFromIndex(index),
  y: getYFromIndex(index),
});

export function getIndexFromXY(xy) {
  return xy.x >= 0 && xy.y >= 0 ? xy.x + xy.y * 8 : -1;
}

export function getXYFromSAN(pos) {
  let x;
  let y;

  if (pos.length === 1) {
    y = parseInt(pos.charAt(0), 10) - 1;
    x = -1;
    if (Number.isNaN(y)) {
      x = parseInt(pos.charAt(0), 18) - 10;
      y = -1;
    }
  } else {
    x = parseInt(pos.charAt(0), 18) - 10;
    y = parseInt(pos.charAt(1), 10) - 1;
  }

  return { x, y };
}

export function getIndexFromSAN(pos) {
  return getIndexFromXY(getXYFromSAN(pos));
}

/**
 * Other utils
 */

export function getPieceTypeFromSAN(sanType) {
  return {
    K: 0x01,
    Q: 0x02,
    R: 0x03,
    B: 0x04,
    N: 0x05,
    P: 0x06,
  }[sanType];
}

export function getColorFromSAN(sanColor) {
  return {
    white: PieceColor.white,
    black: PieceColor.black,
  }[sanColor];
}
