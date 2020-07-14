export const Direction = {
  up: 8,
  down: -8,
  right: 1,
  left: -1,
};

export const PieceType = {
  empty: 0x00,
  king: 0x01,
  queen: 0x02,
  rook: 0x03,
  bishop: 0x04,
  knight: 0x05,
  pawn: 0x06,
};

export const PieceColor = {
  white: 0x10,
  black: 0x20,
};

export const PieceChar = {};
PieceChar[0x00] = '';
PieceChar[0x11] = '♔';
PieceChar[0x12] = '♕';
PieceChar[0x13] = '♖';
PieceChar[0x14] = '♗';
PieceChar[0x15] = '♘';
PieceChar[0x16] = '♙';
PieceChar[0x21] = '♚';
PieceChar[0x22] = '♛';
PieceChar[0x23] = '♜';
PieceChar[0x24] = '♝';
PieceChar[0x25] = '♞';
PieceChar[0x26] = '♟';

export const PieceNames = {};
PieceNames[0x00] = '';
PieceNames[0x01] = 'king';
PieceNames[0x02] = 'queen';
PieceNames[0x03] = 'rook';
PieceNames[0x04] = 'bishop';
PieceNames[0x05] = 'knight';
PieceNames[0x06] = 'pawn';
PieceNames[0x11] = 'white king';
PieceNames[0x12] = 'white queen';
PieceNames[0x13] = 'white rook';
PieceNames[0x14] = 'white bishop';
PieceNames[0x15] = 'white knight';
PieceNames[0x16] = 'white pawn';
PieceNames[0x21] = 'black king';
PieceNames[0x22] = 'black queen';
PieceNames[0x23] = 'black rook';
PieceNames[0x24] = 'black bishop';
PieceNames[0x25] = 'black knight';
PieceNames[0x26] = 'black pawn';

