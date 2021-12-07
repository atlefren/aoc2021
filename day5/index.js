const { run } = require("../run");

const splitAndParse = (split, parse, names) => (input) =>
  input
    .split(split)
    .reduce((acc, e, i) => ({ ...acc, [names[i]]: parse(e) }), {});

const parsePoint = splitAndParse(",", (e) => parseInt(e, 10), ["x", "y"]);

const parseLine = splitAndParse(" -> ", parsePoint, ["start", "end"]);

const getCoord = (input, coord) =>
  input.reduce((acc, l) => [...acc, l.start[coord], l.end[coord]], []);

const getMinMax = (minName, maxName, range) => ({
  [minName]: Math.min(...range),
  [maxName]: Math.max(...range),
});

const getExtents = (input) => ({
  ...getMinMax("minX", "maxX", getCoord(input, "x")),
  ...getMinMax("minY", "maxY", getCoord(input, "y")),
});

const getBbox = (segment) => ({
  xmin: Math.min(segment.start.x, segment.end.x),
  xmax: Math.max(segment.start.x, segment.end.x),
  ymin: Math.min(segment.start.y, segment.end.y),
  ymax: Math.max(segment.start.y, segment.end.y),
});

const within = (point, bbox) =>
  point.x >= bbox.xmin &&
  point.x <= bbox.xmax &&
  point.y >= bbox.ymin &&
  point.y <= bbox.ymax;

const colinear = (a, b, c) =>
  (b.x - a.x) * (c.y - a.y) == (c.x - a.x) * (b.y - a.y);

const coversPoint = (point, segment) =>
  colinear(segment.start, segment.end, point) &&
  within(point, getBbox(segment));

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

const getOverlaps = (input) => {
  const extents = getExtents(input);
  return range(extents.minY, extents.maxY)
    .map((y) =>
      range(extents.minX, extents.maxX).map((x) =>
        input.reduce((acc, s) => (coversPoint({ x, y }, s) ? acc + 1 : acc), 0)
      )
    )
    .reduce((acc, l) => acc + l.filter((c) => c >= 2).length, 0);
};

const task1 = (input) =>
  getOverlaps(
    input.filter((s) => s.start.x === s.end.x || s.start.y === s.end.y)
  );

const task2 = (input) => getOverlaps(input);

run(parseLine, task1, task2, true);
