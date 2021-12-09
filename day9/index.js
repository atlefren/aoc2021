const { run } = require("../run");

const parse = (i) => i.split("").map((c) => parseInt(c, 10));

const getElement = (lst, i) => {
  try {
    return lst[i];
  } catch {
    return undefined;
  }
};

const getELement2d = (lst, i, j) => getElement(getElement(lst, i), j);

const getNeighbours = (lst, i, j) =>
  [
    getELement2d(lst, i, j - 1),
    getELement2d(lst, i, j + 1),
    getELement2d(lst, i + 1, j),
    getELement2d(lst, i - 1, j),
  ].filter((e) => e !== undefined);

const isLowerThan = (e, lst) => lst.every((el) => el > e);

const isLowPoint = (e, i, j, input) =>
  isLowerThan(e, getNeighbours(input, i, j));

const task1 = (input) =>
  input
    .reduce(
      (acc, l, i) => [
        ...acc,
        ...l.reduce(
          (acc, e, j) => [...acc, isLowPoint(e, i, j, input) ? e : undefined],
          []
        ),
      ],
      []
    )
    .filter((e) => e !== undefined)
    .map((e) => e + 1)
    .reduce((acc, e) => acc + e, 0);

const shouldContinue = (e) => e !== undefined && e !== 9;

const blank = (matrix, i, j, val) => (matrix[i][j] = val);

const getBasin = (i, j, input) => {
  blank(input, i, j, 9);
  return [
    [i, j - 1],
    [i, j + 1],
    [i + 1, j],
    [i - 1, j],
  ].reduce(
    (acc, p) =>
      shouldContinue(getELement2d(input, p[0], p[1]))
        ? [...acc, ...getBasin(p[0], p[1], input)]
        : acc,
    [getELement2d(input, i, j)]
  );
};

const getBasinSizeIfLowPoint = (e, i, j, input) =>
  isLowPoint(e, i, j, input) ? [getBasin(i, j, input).length] : [];

const threeLargest = (arr) => [...arr].sort((a, b) => b - a).slice(0, 3);

const task2 = (input) =>
  threeLargest(
    input.reduce(
      (acc, l, i) => [
        ...acc,
        ...l.reduce(
          (acc, e, j) => [...acc, ...getBasinSizeIfLowPoint(e, i, j, input)],
          []
        ),
      ],
      []
    )
  ).reduce((acc, i) => acc * i, 1);

run(parse, task1, task2, true);
