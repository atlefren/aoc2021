const readFile = require("../readFile");
const { slidingWindow } = require("../util");

const getIncreases = (lst) =>
  slidingWindow(lst, 2)
    .map((p) => p[1] > p[0])
    .filter((isInc) => isInc);

const getIncreasesPairs = (lst) =>
  getIncreases(
    slidingWindow(lst, 3).map((group) => group.reduce((acc, e) => acc + e, 0))
  );

const main = async () => {
  const testInput = await readFile("testinput.txt", (e) => parseInt(e, 10));
  console.log(getIncreases(testInput).length === 7);

  const input = await readFile("input.txt", (e) => parseInt(e, 10));
  console.log(getIncreases(input).length === 1446);

  console.log(getIncreasesPairs(testInput).length === 5);

  console.log(getIncreasesPairs(input).length);
};

main();
