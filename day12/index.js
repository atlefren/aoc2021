const { run } = require("../run");

const parse = (i) => i.split("-");

const findPaths = (input, node) =>
  [
    ...input.filter((p) => p[0] === node),
    ...input.filter((p) => p[1] === node).map((p) => [p[1], p[0]]),
  ].map((p) => p[1]);

const isLowerCase = (str) =>
  str == str.toLowerCase() && str != str.toUpperCase();

const count = (path, c) => path.filter((cc) => cc === c).length;

const keepWalking = (options, path, map, allowedTwice) =>
  options.length === 0
    ? path
    : options.map((next) => walk([...path, next], map, allowedTwice));

const getOptions = (map, current, allowedTwice, path) =>
  findPaths(map, current).filter((n) =>
    isLowerCase(n)
      ? allowedTwice == n
        ? count(path, n) < 2
        : !path.includes(n)
      : true
  );

const walk = (path, map, allowedTwice) =>
  path[path.length - 1] === "end"
    ? path
    : keepWalking(
        getOptions(map, path[path.length - 1], allowedTwice, path),
        path,
        map,
        allowedTwice
      );

const flatten = (arr) =>
  arr.reduce(
    (acc, a) => (Array.isArray(a[0]) ? [...acc, ...flatten(a)] : [...acc, a]),
    []
  );

const getPaths = (input, allowedTwice) =>
  flatten(walk(["start"], input, allowedTwice)).filter(
    (p) => p[p.length - 1] === "end"
  );

const task1 = (input) => getPaths(input, []).length;

const unique = (lst) => [...new Set(lst)];

const task2 = (input) =>
  unique(
    unique(input.reduce((acc, i) => [...acc, ...i], []))
      .filter(isLowerCase)
      .filter((c) => !["start", "end"].includes(c))
      .reduce(
        (acc, allowedTwice) => [
          ...acc,
          ...getPaths(input, allowedTwice).map((l) => l.join(",")),
        ],
        []
      )
  ).length;

run(parse, task1, task2, true);
