const { run } = require("../run");
const { range } = require("../util");
const digits = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const sum = (arr) => arr.reduce((acc, e) => acc + e, 0);
const lengths = Object.keys(digits)
  .filter((k) => ["1", "4", "7", "8"].includes(k))
  .map((k) => digits[k])
  .map((d) => d.length);

const getUnique = (output) =>
  output.map((d) => d.length).filter((l) => lengths.includes(l));

const countInOutput = (input) =>
  sum(
    input
      .map((i) => i.output)
      .map(getUnique)
      .map((m) => m.length)
  );

const splitAndParse = (split, parse, names) => (input) =>
  input
    .split(split)
    .reduce((acc, e, i) => ({ ...acc, [names[i]]: parse(e) }), {});

const parseDigits = (i) => i.trim().split(" ");

const parse = splitAndParse("|", parseDigits, ["input", "output"]);

const task1 = (i) => countInOutput(i);

const findLetters = (digit, used) =>
  digit.filter((d) => !Object.values(used).includes(d)).join("");

const findCandidates = (digit, input, used) =>
  input
    .filter((i) => i.length === digit.length)
    .map((d) => d.split(""))[0]
    .filter((d) => !Object.keys(used).includes(d))
    .join("");

const getCandidatesFor = (digit, input, used) => ({
  ...used,
  [findCandidates(digit, input, used)]: findLetters(digit, used),
});

const findInDict = (dict, compare) =>
  Object.keys(dict).find((key) => compare(key, dict[key]));

const reverse = (dict) =>
  Object.keys(dict).reduce((acc, k) => ({ ...acc, [dict[k]]: k }), {});

const countLetter = (input, letter) =>
  input.filter((i) => i.includes(letter)).length;

const lookup = (segs) => findInDict(digits, (_, v) => v.join("") === segs);

const sort = (l) => [...l.sort()];

const sortStr = (l) => sort(l.split("")).join("");

const analyseLine = (line) => {
  const easy = [1, 7, 4, 8];

  const dict = easy.reduce(
    (acc, i) => getCandidatesFor(digits[i], line.input, acc),
    {}
  );

  const r = reverse(dict);

  const used = [...new Set([...r["acf"].split(""), ...r["bcdf"].split("")])];

  const a = r["acf"].split("").find((l) => !r["cf"].split("").includes(l));
  const b = r["bcdf"]
    .split("")
    .filter((l) => !r["cf"].split("").includes(l))
    .find((l) => countLetter(line.input, l) === 6);
  const f = r["cf"].split("").find((l) => countLetter(line.input, l) === 9);
  const c = r["cf"].split("").find((l) => l !== f);
  const d = r["bcdf"]
    .split("")
    .find((l) => l !== b && !r["cf"].split("").includes(l));
  const e = "abcdefg"
    .split("")
    .find((l) => !used.includes(l) && countLetter(line.input, l) === 4);
  const g = "abcdefg"
    .split("")
    .find((l) => !used.includes(l) && countLetter(line.input, l) === 7);

  const alphabet = reverse({
    a,
    b,
    c,
    d,
    e,
    f,
    g,
  });

  const meh = line.input.reduce(
    (acc, l) => ({
      ...acc,
      [sortStr(l)]: lookup(
        [...l.split("").map((c) => alphabet[c])].sort().join("")
      ),
    }),
    {}
  );

  return parseInt(line.output.map((l) => meh[sortStr(l)]).join(""), 10);
};

const task2 = (i) => i.reduce((acc, l) => acc + analyseLine(l), 0);

run(parse, task1, task2, true);
