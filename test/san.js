import { san, sanBuildBoard } from '../src/san';
import { PieceColor, PieceType } from '../src/engine/constants';
import { cell } from '../src/engine/board';

describe('san()', () => {
  it('should parse index, color and piece', () => {
    expect(san('e2 white Q')).to.eql({
      index: 12,
      color: PieceColor.white,
      type: PieceType.queen
    });
  });

  it('should parse only index', () => {
    expect(san('e2')).to.equal(12);
  });

  it('should parse multiple indices', () => {
    expect(san('e2 e3')).to.eql([12, 20]);
  });
  it('should parse color and piece', () => {
    expect(san('white P')).to.eql({ color: PieceColor.white, type: PieceType.pawn });
  });
});

describe('sanBuildBoard()', () => {
  it('should build board with single entry', () => {
    const board = sanBuildBoard('white P e2');
    expect(board).to.have.lengthOf(64);
    expect(board[san('e2')]).to.equal(cell(PieceColor.white, PieceType.pawn));
  });
  it('should build board with two entries', () => {
    const board = sanBuildBoard('white Q e4, black K d2');
    expect(board).to.have.lengthOf(64);
    expect(board[san('e4')]).to.equal(cell(PieceColor.white, PieceType.queen));
    expect(board[san('d2')]).to.equal(cell(PieceColor.black, PieceType.king));
  });
});
