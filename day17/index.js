const { run } = require("../run");

const parse = (i) =>
  i
    .replace("target area: ", "")
    .trim()
    .split(", ")
    .map((e) => e.split("="))
    .reduce(
      (acc, e) => ({
        ...acc,
        [e[0]]: e[1] ? e[1].split("..").map((n) => parseInt(n, 10)) : undefined,
      }),
      {}
    );

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

const changePos = (pos, velocity) => ({
  x: pos.x + velocity.x,
  y: pos.y + velocity.y,
});

const towardZero = (n) => (n === 0 ? 0 : n > 0 ? n - 1 : n + 1);

const changeVelocity = (velocity) => ({
  x: towardZero(velocity.x),
  y: velocity.y - 1,
});

const step = ({ pos, velocity }) => ({
  pos: changePos(pos, velocity),
  velocity: changeVelocity(velocity),
});

const isWithin = (pos, target) =>
  pos.x >= target.x[0] &&
  pos.x <= target.x[1] &&
  pos.y >= target.y[0] &&
  pos.y <= target.y[1];

const print = (positions, target) => {
  const x = positions.map((p) => p.x);
  const y = positions.map((p) => p.y);

  const minX = Math.min(...x, target.x[0]);
  const maxX = Math.max(...x, target.x[1]);
  const minY = Math.min(...y, target.y[0]);
  const maxY = Math.max(...y, target.y[1]);

  for (let j = maxY; j >= minY; j--) {
    let line = "";
    for (let i = minX; i <= maxX; i++) {
      if (positions.some((p) => p.x === i && p.y === j)) {
        line += "#";
      } else if (isWithin({ x: i, y: j }, target)) {
        line += "T";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
};

const willReach = (initialVelocity, target) => {
  let pos2 = { x: 0, y: 0 };

  const positions = [];

  while (true) {
    const { pos, velocity } = step({ pos: pos2, velocity: initialVelocity });
    // console.log(pos, velocity);
    positions.push(pos);

    if (isWithin(pos, target)) {
      //console.log("reaches");
      return positions;
    }
    //console.log(pos.x, target.x[1]);
    if (
      pos.x > target.x[1] ||
      (velocity.y < 0 && pos.y < Math.min(target.y[1], target.y[0]))
    ) {
      return null;
    }
    pos2 = pos;
    initialVelocity = velocity;
  }
};

const getMaxHeight = (positions) => Math.max(...positions.map((p) => p.y));

const getPossible = (input) =>
  range(-1000, 1000).reduce(
    (acc, yVelocity) => [
      ...acc,
      ...range(0, 1000)
        .map((xVelocity) => willReach({ x: xVelocity, y: yVelocity }, input))
        .filter((r) => r !== null),
    ],
    []
  );

const task1 = (input) => Math.max(...getPossible(input).map(getMaxHeight));
const task2 = (input) => getPossible(input).length;

run(parse, task1, task2, true, "");
