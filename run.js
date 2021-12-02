const readFile = require("./readFile");

const run = async (parse, task1, task2) => {
  const testInput = await readFile("testinput.txt", parse);
  const input = await readFile("input.txt", parse);

  console.log(
    JSON.stringify(
      {
        task1Test: task1(testInput),
        task1: task1(input),
        task2Test: task2(testInput),
        task2: task2(input),
      },
      undefined,
      4
    )
  );
};

module.exports = { run };
