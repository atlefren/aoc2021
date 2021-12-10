const { run } = require("../run");

const parse = (i) => i.split("");

const pairs = {
  "{": "}",
  "[": "]",
  "(": ")",
  "<": ">",
};

const scores = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const breakReduce = (arr, val) => {
  arr.splice(1);
  return val;
};

const parseLine = (onErr) => (line) =>
  line.reduce(
    (acc, b, _, arr) =>
      pairs[b]
        ? [pairs[b], ...acc]
        : b === acc[0]
        ? acc.slice(1)
        : onErr(acc, b, arr),
    []
  );

const getMissing = parseLine((_, b, arr) => breakReduce(arr, b));
const fixLine = parseLine((acc) => acc);

const points2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const getAcScore = (missing) =>
  missing.reduce((acc, c) => acc * 5 + points2[c], 0);

const task1 = (input) =>
  input
    .reduce((acc, l) => [...acc, scores[getMissing(l)]], [])
    .filter((r) => r !== undefined)
    .reduce((acc, s) => acc + s, 0);

const getMiddle = (numbers) =>
  [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)];

const task2 = (input) =>
  getMiddle(
    input
      .filter((l) => scores[getMissing(l)] === undefined)
      .map(fixLine)
      .map(getAcScore)
  );

run(parse, task1, task2, true);
