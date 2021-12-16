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

const getNode = (input, i, j, value) => {
  return {
    [print(i, j + 1)]: getElement2d(input, i, j + 1),
    [print(i + 1, j)]: getElement2d(input, i + 1, j),
  };
};

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

const getCost = (input, val) => {
  const [i, j] = val.split("_").map((v) => parseInt(v, 10));
  return input[i][j];
};

const cost = (p, input) =>
  p.slice(1).reduce((acc, e) => acc + getCost(input, e), 0);

const getShortestPathCost = (input) => {
  const height = input.length - 1;

  const graph = new Graph(getMap(input));

  const p = graph.findShortestPath(print(0, 0), print(height, height));

  return cost(p, input);
};

const task1 = (input) => getShortestPathCost(input);

const printMatrix = (m) => m.reduce((acc, l) => acc + l.join(" ") + "\n", "");

const getElement2 = (input, i, j) => {
  const jj = j % input.length;
  const ii = i % input.length;
  const val = input[ii][jj];

  const timesi = Math.floor(i / input.length);
  const timesj = Math.floor(j / input.length);

  const times = timesi + timesj;

  const res = val + times;
  return res < 10 ? res : (res % 10) + 1;
};

const getComplete = (input, times) => {
  return range(input.length * times).map((i) =>
    range(input.length * times).map((j) => getElement2(input, i, j))
  );
};

const task2 = (input) => {
  return getShortestPathCost(getComplete(input, 5));

  //console.log(printMatrix(getComplete([[8]], 5)));

  //console.log(getElement2(input, 4, 0));
  /*console.log(getElement2(input, 0, 10));
  console.log(getElement2(input, 10, 0));
  console.log(getElement2(input, 10, 10));*/
};

run(parse, task1, task2, true);
