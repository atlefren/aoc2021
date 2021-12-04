const { run } = require("../run");

const parseNumbers = (input) => input[0].split(",").map((n) => parseInt(n, 10));

const parseLine = (line) =>
  line
    .trim()
    .replace(/ +(?= )/g, "")
    .split(" ")
    .map((l) => parseInt(l, 10));

const parseBoards = (input) =>
  input.slice(2).reduce(
    (acc, line) => {
      if (line === "") {
        acc.push([]);
        return acc;
      }
      acc[acc.length - 1].push(parseLine(line));
      return acc;
    },
    [[]]
  );

const mark = (board, number) =>
  board.map((line) => line.map((n) => (number === n ? "x" : n)));

const transpose = (m) => m[0].map((_, i) => m.map((x) => x[i]));

const isCompleteHor = (board) => board.find((l) => l.every((n) => n === "x"));

const isComplete = (board) =>
  isCompleteHor(board) || isCompleteHor(transpose(board));

const play = (numbers, boards) => {
  boards = boards.map((board) => mark(board, numbers[0]));
  const complete = boards.findIndex(isComplete);

  if (complete != -1) {
    return [boards[complete], numbers[0], complete, boards];
  }

  return play(numbers.slice(1), boards);
};

const sum = (board) =>
  board.reduce(
    (acc, line) =>
      acc + line.filter((i) => i != "x").reduce((acc, e) => acc + e, 0),
    0
  );

const task1 = (input) => {
  const [board, number] = play(parseNumbers(input), parseBoards(input));
  return sum(board) * number;
};

const play2 = (numbers, boards) => {
  const [_, number, _, remainingBoards] = play(numbers, boards);
  const remaining = remainingBoards.filter((b) => !isComplete(b));
  if (remaining.length === 1) {
    const [wn, n] = play(numbers.slice(numbers.indexOf(number) + 1), remaining);
    return sum(wn) * n;
  }
  return play2(numbers.slice(numbers.indexOf(number) + 1), remaining);
};

const task2 = (input) => play2(parseNumbers(input), parseBoards(input));

run((a) => a, task1, task2, true);
