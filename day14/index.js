const { run } = require("../run");

const parseRule = (r) => r.split(" -> ");

const parseInput = (i) => ({
  template: i[0],
  rules: new Map(i.slice(2).map(parseRule)),
});

const parse = (i) => parseInput(i.split("\n"));

const maxMinDiff = (els) => Math.max(...els) - Math.min(...els);

const step = (numPairs, rules, elementCount) =>
  [...numPairs.entries()]
    .map(([pair, count]) => [pair, count, rules.get(pair)])
    .reduce(
      (map, [[a, b], count, insert]) => (
        elementCount.set(insert, (elementCount.get(insert) || 0) + count),
        [a + insert, insert + b].reduce(
          (map, p) => map.set(p, (map.get(p) || 0) + count),
          map
        )
      ),
      new Map()
    );

const getCount = (template) =>
  template
    .split("")
    .reduce((count, v) => count.set(v, (count.get(v) || 0) + 1), new Map());

const getPairs = (template) =>
  template
    .split("")
    .reduce(
      (map, v, i, arr) =>
        i + 1 < arr.length
          ? map.set(v + arr[i + 1], (map.get(v + arr[i + 1]) || 0) + 1)
          : map,
      new Map()
    );

const loop = (numPairs, rules, count, steps) => {
  while (steps--) {
    numPairs = step(numPairs, rules, count);
  }
  return [...count.values()];
};

const solve = (input, steps) =>
  maxMinDiff(
    loop(getPairs(input.template), input.rules, getCount(input.template), steps)
  );

const task1 = (input) => solve(input, 10);

const task2 = (input) => solve(input, 40);

run(parse, task1, task2, true, "");
