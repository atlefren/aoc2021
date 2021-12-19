const { run } = require("../run");

const parse = (number) => {
  try {
    return JSON.parse(number);
  } catch {
    return null;
  }
};

const add = (n1, n2) => reduce([n1, n2]);

const setNewVal = (arr, i, val) =>
  arr.map((v, idx) =>
    idx === i[0] ? (i.length > 1 ? setNewVal(v, i.slice(1), val) : val) : v
  );

const getIndicies = (n, path = []) => {
  if (!Array.isArray(n)) {
    return [{ path, val: n }];
  } else {
    let res = [{ path, val: n }];
    for (let i = 0; i < n.length; i++) {
      res = [...res, ...getIndicies(n[i], [...path, i])];
    }
    return res;
  }
};

const getExplodeIndex = (indicies) =>
  indicies.findIndex((i) => i.path.length >= 4 && Array.isArray(i.val));

const explode = (n, indicies, explodeIdx) => {
  const path = indicies[explodeIdx].path;
  const val = indicies[explodeIdx].val;

  let arr = setNewVal(n, path, 0);

  const left = indicies
    .slice(0, explodeIdx)
    .filter((e) => !Array.isArray(e.val))
    .slice(-1)[0];

  if (left) {
    arr = setNewVal(arr, left.path, left.val + val[0]);
  }

  const right = indicies
    .slice(explodeIdx + 3)
    .filter((e) => !Array.isArray(e.val))[0];
  if (right) {
    arr = setNewVal(arr, right.path, right.val + val[1]);
  }

  return arr;
};

const splitPair = (p) => [Math.floor(p / 2), Math.ceil(p / 2)];

const getSplitElem = (indicies) =>
  indicies.find((i) => !Array.isArray(i.val) && i.val >= 10);

const split = (n, splitElem) =>
  setNewVal(n, splitElem.path, splitPair(splitElem.val));

const reduce = (n) => {
  let res = n;
  const indicies = getIndicies(n);

  const explodeIdx = getExplodeIndex(indicies);

  let changed = false;
  if (explodeIdx > -1) {
    res = explode(n, indicies, explodeIdx);
    changed = true;
  } else {
    const splitElem = getSplitElem(indicies);
    if (splitElem) {
      res = split(n, splitElem);
      changed = true;
    }
  }

  return changed ? reduce(res) : res;
};

const sumList = (lst) => lst.slice(1).reduce((acc, e) => add(acc, e), lst[0]);

const getMagnitude = (pair) =>
  Array.isArray(pair)
    ? 3 * getMagnitude(pair[0]) + 2 * getMagnitude(pair[1])
    : pair;

const task1 = (input) => getMagnitude(sumList(input));

const task2 = (input) =>
  Math.max(
    ...input.reduce(
      (acc, p1) => [...acc, ...input.map((p2) => getMagnitude(add(p1, p2)))],
      []
    )
  );

run(parse, task1, task2, true);
