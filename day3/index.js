const { run } = require("../run");
const { range } = require("../util");

const parseBit = (b) => b.split("");

const getRow = (bits, index) => bits.map((b) => b[index]);

const getMostCommon = (bits) =>
  bits.filter((b) => b === "1").length >= bits.length / 2 ? "1" : "0";

const getLeastCommon = (bits) =>
  bits.filter((b) => b === "1").length < bits.length / 2 ? "1" : "0";

const toDecimal = (bit) => parseInt(bit.join(""), 2);

const eachRow = (bits, f) =>
  range(bits[0].length).map((i) => f(getRow(bits, i)));

const getGammaRate = (bits) => toDecimal(eachRow(bits, getMostCommon));

const getEpsilonRate = (bits) => toDecimal(eachRow(bits, getLeastCommon));

const task1 = (input) => getGammaRate(input) * getEpsilonRate(input);

const loop = (bits, i, get) => {
  const mc = get(getRow(bits, i));
  const r = bits.filter((b) => b[i] === mc);
  return r.length > 1 ? loop(r, i + 1, get) : toDecimal(r[0]);
};

const task2 = (input) =>
  loop(input, 0, getMostCommon) * loop(input, 0, getLeastCommon);

run(parseBit, task1, task2, true);
