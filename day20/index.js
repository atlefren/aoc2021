const { run } = require("../run");

const parse = (i) => i;

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

const getElement2d = (lst, i, j, empty) =>
  lst[j] && lst[j][i] ? lst[j][i] : empty;

const getNeighbourhood = (m, i, j, empty) =>
  range(j - 1, j + 1)
    .reduce(
      (acc, jj) => [...acc, ...range(i - 1, i + 1).map((ii) => [ii, jj])],
      []
    )
    .map((ij) => getElement2d(m, ...ij, empty));

const toBinary = (matrix) =>
  parseInt(matrix.map((p) => (p === "#" ? 1 : 0)).join(""), 2);

const enhance = (enhancement, image, i, j, background) =>
  enhancement[toBinary(getNeighbourhood(image, i, j, background))];

const enhanceImage = (enhancement, image, background) =>
  image.reduce(
    (acc, l, j) => [
      ...acc,
      l.map((_, i) => enhance(enhancement, image, i, j, background)),
    ],
    []
  );

const getBackground = (i, enhancement) =>
  enhancement[0] === "#" && enhancement[enhancement.length - 1] == "."
    ? i % 2 === 0
      ? "."
      : "#"
    : ".";

const loop = (image, enhancement, times, i = 0) =>
  i == times
    ? image
    : loop(
        enhanceImage(
          enhancement,
          pad(image, getBackground(i, enhancement)),
          getBackground(i, enhancement)
        ),
        enhancement,
        times,
        i + 1
      );

const pad = (image, background) => [
  range(0, image[0].length + 1).map((_) => background),
  ...image.map((l) => [background, ...l, background]),
  range(0, image[0].length + 1).map((_) => background),
];

const countLit = (image) =>
  image.reduce((acc, l) => acc + l.filter((e) => e === "#").length, 0);

const getImage = (input) => input.slice(2).map((l) => l.split(""));
const getEnhancement = (input) => input[0].split("");

const task1 = (input) =>
  countLit(loop(getImage(input), getEnhancement(input), 2));

const task2 = (input) =>
  countLit(loop(getImage(input), getEnhancement(input), 50));

run(parse, task1, task2, true);
