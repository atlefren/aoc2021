const { run } = require("../run");
const { Graph } = require("./graph");
const { range } = require("../util");
const parse = (i) => i.split("").map((v) => parseInt(v, 10));

const getElement = (lst, i) => {
  try {
    return lst[i];
  } catch {
    return undefined;
  }
};

const getElement2d = (lst, i, j) => getElement(getElement(lst, i), j);

const print = (i, j) => `${i}_${j}`;

const getNode = (input, i, j) =>
  [
    [i, j + 1],
    [i, j - 1],
    [i + 1, j],
    [i - 1, j],
  ].reduce(
    (acc, [i, j]) => ({ ...acc, [print(i, j)]: getElement2d(input, i, j) }),
    {}
  );

const getMap = (input) =>
  input.reduce(
    (acc, l, i) => ({
      ...acc,
      ...l.reduce(
        (a, e, j) => ({ ...a, [print(i, j)]: getNode(input, i, j, e) }),
        {}
      ),
    }),
    {}
  );

const getCost = (input, val) =>
  getElement2d(input, ...val.split("_").map((v) => parseInt(v, 10)));

const cost = (p, input) =>
  p.slice(1).reduce((acc, e) => acc + getCost(input, e), 0);

const getShortestPathCost = (input) =>
  cost(
    new Graph(getMap(input)).findShortestPath(
      print(0, 0),
      print(input.length - 1, input.length - 1)
    ),
    input
  );
const wrapAround = (val) => (val < 10 ? val : (val % 10) + 1);

const getElement2 = (input, i, j) =>
  wrapAround(
    input[i % input.length][j % input.length] +
      Math.floor(i / input.length) +
      Math.floor(j / input.length)
  );

const getComplete = (input, times) =>
  range(input.length * times).map((i) =>
    range(input.length * times).map((j) => getElement2(input, i, j))
  );

const task1 = (input) => getShortestPathCost(input);

const task2 = (input) => getShortestPathCost(getComplete(input, 5));

run(parse, task1, task2, false);
