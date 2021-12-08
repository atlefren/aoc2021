const { run } = require("../run");

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
  digit.filter((d) => !Object.keys(used).includes(d)).join("");

const findCandidates = (digit, input, used) =>
  input
    .filter((i) => i.length === digit.length)
    .map((d) => d.split(""))[0]
    .filter((d) => !Object.values(used).includes(d));

const getCandidatesFor = (digit, input, used) => ({
  ...used,
  [findLetters(digit, used)]: findCandidates(digit, input, used),
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

const getDigit = (d) => digits[d].join("");

const getDictionaryForUniqueNumbers = (input) =>
  [1, 7, 4, 8].reduce((acc, i) => getCandidatesFor(digits[i], input, acc), {});

const getElement = (dict, input, d) => ({
  exclude: (digit) =>
    getElement(
      dict,
      input,
      d.filter((l) => !dict[getDigit(digit)].includes(l))
    ),
  withCount: (count) =>
    getElement(
      dict,
      input,
      d.filter((l) => countLetter(input, l) === count)
    ),
  res: () => d[0],
});

const element = (dict, input, digit) =>
  getElement(dict, input, dict[getDigit(digit)]);

const getAlphabet = (input, dict) =>
  reverse({
    // a is the part of 7 that is not in 1
    a: element(dict, input, 7).exclude(1).res(),
    //b is the segment in 4, which is not part of 1 and is used 6 times
    b: element(dict, input, 4).exclude(1).withCount(6).res(),
    //and c is the part of 1 that is used 8 times
    c: element(dict, input, 1).withCount(8).res(),
    //d is the part of 4 that is not used by 1 and is used 7 times
    d: element(dict, input, 4).exclude(1).withCount(7).res(),
    //e is the segment not used by 7 and 4, which is used 4 times
    e: element(dict, input, 8).exclude(7).exclude(4).withCount(4).res(),
    //f is the part of 1 that is used 9 times
    f: element(dict, input, 1).withCount(9).res(),
    //g is the segment not used by 7 and 4, which is used 7 times
    g: element(dict, input, 8).exclude(7).exclude(4).withCount(7).res(),
  });

const translate = (output, dictionary) =>
  parseInt(output.map((l) => dictionary[sortStr(l)]).join(""), 10);

const buildDictionary = (input, alphabet) =>
  input.reduce(
    (acc, l) => ({
      ...acc,
      [sortStr(l)]: lookup(
        [...l.split("").map((c) => alphabet[c])].sort().join("")
      ),
    }),
    {}
  );

const analyseLine = (line) =>
  translate(
    line.output,
    buildDictionary(
      line.input,
      getAlphabet(line.input, getDictionaryForUniqueNumbers(line.input))
    )
  );

const task2 = (i) => i.reduce((acc, l) => acc + analyseLine(l), 0);

run(parse, task1, task2, true);
