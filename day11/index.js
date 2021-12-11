const { run } = require("../run");

const parse = (i) => i.split("").map((i) => parseInt(i, 10));

const getElement = (lst, i) => {
  try {
    return lst[i];
  } catch {
    return undefined;
  }
};

const getELement2d = (lst, i, j) => getElement(getElement(lst, i), j);

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

const getNeighbours = (m, i, j) =>
  range(i - 1, i + 1)
    .reduce(
      (acc, ii) => [...acc, ...range(j - 1, j + 1).map((jj) => [ii, jj])],
      []
    )
    .filter((e) => !(e.i === i && e.j === j))
    .filter(([i, j]) => getELement2d(m, i, j) !== undefined);

const shouldIncrement = (m, i, j) => ![0, 10].includes(m[i][j]);

const flash = (m, i, j) => {
  if (getELement2d(m, i, j) === 10) {
    m[i][j] = 0;
    getNeighbours(m, i, j).forEach(([i, j]) => {
      if (shouldIncrement(m, i, j)) {
        m[i][j] = m[i][j] + 1;
      }
      flash(m, i, j);
    });
  }
};

const flashMatrix = (matrix) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      flash(matrix, i, j);
    }
  }
  return matrix;
};

const step = (m) =>
  flashMatrix(
    m.reduce(
      (acc, l) => [...acc, l.reduce((acc, e) => [...acc, e + 1], [])],
      []
    )
  );

const countFlashes = (matrix) =>
  matrix.reduce(
    (acc, l) => acc + l.reduce((acc, e) => (e === 0 ? acc + 1 : acc), 0),
    0
  );

const createReturn = (matrix, numFlashes) => ({
  numFlashes: numFlashes + countFlashes(matrix),
  matrix,
});

const loop1 = (matrix, steps) =>
  range(1, steps).reduce(
    (acc) => createReturn(step(acc.matrix), acc.numFlashes),
    { numFlashes: 0, matrix }
  );

const task1 = (input) => loop1(input, 100).numFlashes;

const allZero = (i) => i.every((l) => l.every((i) => i === 0));

const eval2 = (r, i) => (allZero(r) ? i : task2(r, i + 1));

const task2 = (input, i = 1) => eval2(step(input), i);

run(parse, task1, task2, true);
