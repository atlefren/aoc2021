const { run } = require("../run");
const { range } = require("../util");

const parse = (l) => l.split(",").map((l) => parseInt(l, 10));

const loopFish = (fish) => {
  const { newFish, numNew } = fish.reduce(
    (acc, f, index) => {
      if (f.days === 0) {
        acc.newFish[index].days = 6;
        acc.numNew = acc.numNew + f.numNew;
      } else {
        acc.newFish[index].days = f.days - 1;
      }
      return acc;
    },
    { numNew: 0, newFish: fish }
  );

  return numNew > 0 ? [...newFish, { numNew, days: 8 }] : newFish;
};

const simulate = (input, generations) =>
  range(generations).reduce(
    (acc, _) => loopFish(acc),
    input.map((days) => ({ numNew: 1, days }))
  );

const task1 = (input) =>
  simulate(input[0], 80).reduce((acc, e) => acc + e.numNew, 0);

const task2 = (input) =>
  simulate(input[0], 256).reduce((acc, e) => acc + e.numNew, 0);

run(parse, task1, task2, true);
