const { run } = require("../run");

const parseDir = (dir) => (["forward", "down"].includes(dir) ? "+" : "-");

const getInstructions = ([dir, units]) => ({
  dir: dir === "forward" ? "x" : "y",
  units: parseInt(`${parseDir(dir)}${units}`, 10),
});

const parseInput = (line) => getInstructions(line.split(" "));

const drive = (applyCommand) => (instructions) =>
  instructions.reduce(applyCommand, { x: 0, y: 0, aim: 0 });

const applyCommand1 = (prev, ins) => ({
  ...prev,
  [ins.dir]: prev[ins.dir] + ins.units,
});

const applyCommand2 = (prev, ins) =>
  ins.dir === "y"
    ? { ...prev, aim: prev.aim + ins.units }
    : { ...prev, x: prev.x + ins.units, y: prev.y + prev.aim * ins.units };

const product = (pos) => pos.x * pos.y;

const task1 = (input) => product(drive(applyCommand1)(input));
const task2 = (input) => product(drive(applyCommand2)(input));

run(parseInput, task1, task2);
