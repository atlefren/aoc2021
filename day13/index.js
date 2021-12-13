const { run } = require("../run");
const { range } = require("../util");

const parseFold = (fold) =>
  fold
    .replace("fold along ", "")
    .split("=")
    .map((e, i) => (i == 1 ? parseInt(e, 10) : e));

const parse = (input) => ({
  dots: input
    .slice(0, input.indexOf(""))
    .map((l) => l.split(",").map((n) => parseInt(n, 10))),
  folds: input.slice(input.indexOf("") + 1).map(parseFold),
});

const print = (m) => m.reduce((acc, l) => acc + l.join("") + "\n", "");

const hasDot = (dots, i, j) =>
  dots.find((d) => d[0] === i && d[1] === j) !== undefined;

const getHeight = (dots) => Math.max(...dots.map((d) => d[1])) + 1;
const getWidth = (dots) => Math.max(...dots.map((d) => d[0])) + 1;

const toArr = (dots) =>
  range(getHeight(dots)).reduce(
    (acc, j) => [
      ...acc,
      range(getWidth(dots)).reduce(
        (acc, i) => [...acc, hasDot(dots, i, j) ? "#" : " "],
        []
      ),
    ],
    []
  );

const flipy = (dots) => dots.reverse();

const flipx = (dots) => dots.reduce((acc, l) => [...acc, l.reverse()], []);

const merge = (d1, d2) =>
  d1.reduce(
    (acc, l, j) => [
      ...acc,
      l.reduce((acc, e, i) => [...acc, e === "#" ? "#" : d2[j][i]], []),
    ],
    []
  );

const getLeft = (dots, i) =>
  dots.reduce((acc, l) => [...acc, l.slice(0, i)], []);

const getRight = (dots, i) => dots.reduce((acc, l) => [...acc, l.slice(i)], []);

const fold = (dots, dir, i) =>
  dir === "y"
    ? merge(dots.slice(0, i), flipy(dots.slice(i + 1)))
    : merge(getLeft(dots, i), flipx(getRight(dots, i)));

const applyFold = (f, dots) => fold(dots, f[0], f[1]);

const countDots = (dots) =>
  dots.reduce((acc, l) => acc + l.filter((e) => e === "#").length, 0);

const task1 = (input) =>
  countDots(applyFold(input.folds[0], toArr(input.dots)));

const task2 = (input) =>
  console.log(
    print(input.folds.reduce((acc, f) => applyFold(f, acc), toArr(input.dots)))
  );

run((input) => parse(input.split("\n")), task1, task2, true, "");
