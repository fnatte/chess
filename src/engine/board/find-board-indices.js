export default function findBoardIndices(board, fn) {
  return board.reduce((indices, cell, index) => {
    if (fn(cell)) {
      indices.push(index);
    }

    return indices;
  }, []);
}
