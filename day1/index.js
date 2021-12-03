const { run } = require("../run");
const { slidingWindow } = require("../util");

const getIncreases = (lst) =>
  slidingWindow(lst, 2)
    .map((p) => p[1] > p[0])
    .filter((isInc) => isInc);

const getIncreasesPairs = (lst) =>
  getIncreases(
    slidingWindow(lst, 3).map((group) => group.reduce((acc, e) => acc + e, 0))
  );

const task1 = (input) => getIncreases(input).length;
const task2 = (input) => getIncreasesPairs(input).length;

run((e) => parseInt(e, 10), task1, task2);
