const { run } = require("../run");
const { range } = require("../util");

const parse = (i) => parseInt(i, 10);

const getCost = (getPrice, pos, positions) =>
  positions.reduce((acc, p) => acc + getPrice(p, pos), 0);

const getTaskSolver = (getPrice) => (input) =>
  range(Math.max(...input)).reduce(
    (acc, p) => Math.min(acc, getCost(getPrice, p, input)),
    Infinity
  );

const sumConsecutive = (to) => (to / 2) * (to + 1);

const task1 = getTaskSolver((from, to) => Math.abs(from - to));

const task2 = getTaskSolver((from, to) => sumConsecutive(Math.abs(from - to)));

run(parse, task1, task2, true, ",");
