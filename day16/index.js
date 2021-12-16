const { run } = require("../run");
const parse = (i) => i;
const { range } = require("../util");

const sumVersions = (packet) =>
  packet.version + packet.children.reduce((acc, p) => acc + sumVersions(p), 0);

const mapping = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

const hex2bin = (hex) =>
  hex
    .split("")
    .map((h) => mapping[h])
    .join("");

const parseHeader = (bits) => ({
  version: parseInt(bits.slice(0, 3), 2),
  typeId: parseInt(bits.slice(3, 6), 2),
  rest: bits.slice(6),
});

const parseLiteral = (bits, str = "") =>
  bits[0] === "0"
    ? { rest: bits.slice(5), value: str + bits.slice(1, 5) }
    : parseLiteral(bits.slice(5), str + bits.slice(1, 5));

const readNumBits = (bits, num) => ({
  read: parseInt(bits.slice(0, num), 2),
  bits: bits.slice(num),
});

const next = (func, { rest, ...result }) => [result, ...func(rest)];

const parseMultiple = (bits) =>
  bits && bits.length > 0 ? next(parseMultiple, parseBits(bits)) : [];

const addToDict = (dict, { rest, ...result }) => ({
  children: [...dict.children, result],
  rest,
});

const parseNum = (bits, num) => {
  return range(num).reduce((acc) => addToDict(acc, parseBits(acc.rest)), {
    children: [],
    rest: bits,
  });
};

const parseType0 = ({ bits, read }) => ({
  children: parseMultiple(bits.slice(0, read)),
  rest: bits.slice(read),
});

const parseType1 = ({ bits, read }) => parseNum(bits, read);

const prepareForNext = (bits, num) => readNumBits(bits.slice(1), num);

const parseOperator = (bits) =>
  bits[0] === "0"
    ? parseType0(prepareForNext(bits, 15))
    : parseType1(prepareForNext(bits, 11));

const parseBits = (binary) => parseContent(parseHeader(binary));

const parseContent = ({ version, typeId, rest }) =>
  typeId === 4
    ? {
        version,
        typeId,
        ...parseLiteral(rest),
        children: [],
      }
    : {
        version,
        typeId,
        ...parseOperator(rest),
      };

const task1 = (input) => sumVersions(parseBits(hex2bin(input)));

const ops = {
  4: (packet) => parseInt(packet.value, 2),
  0: (packet) => packet.children.reduce((acc, p) => acc + calculate(p), 0),
  1: (packet) => packet.children.reduce((acc, p) => acc * calculate(p), 1),
  2: (packet) => Math.min(...packet.children.map(calculate)),
  3: (packet) => Math.max(...packet.children.map(calculate)),
  5: (packet) =>
    calculate(packet.children[0]) > calculate(packet.children[1]) ? 1 : 0,
  6: (packet) =>
    calculate(packet.children[0]) < calculate(packet.children[1]) ? 1 : 0,
  7: (packet) =>
    calculate(packet.children[0]) === calculate(packet.children[1]) ? 1 : 0,
};

const calculate = (packet) => ops[packet.typeId](packet);

const task2 = (input) => calculate(parseBits(hex2bin(input)));

console.log(task1("38006F45291200") === 9);
console.log(task1("EE00D40C823060") === 14);
console.log(task1("8A004A801A8002F478") === 16);
console.log(task1("620080001611562C8802118E34") === 12);
console.log(task1("C0015000016115A2E0802F182340") === 23);
console.log(task1("A0016C880162017C3686B18A3D4780") === 31);

console.log(task2("C200B40A82") === 3);
console.log(task2("04005AC33890") === 54);
console.log(task2("880086C3E88112") === 7);
console.log(task2("CE00C43D881120") === 9);
console.log(task2("D8005AC2A8F0") === 1);
console.log(task2("F600BC2D8F") === 0);
console.log(task2("9C005AC2F8F0") === 0);
console.log(task2("9C0141080250320F1802104A08") === 1);

run(parse, task1, task2, true, null);
