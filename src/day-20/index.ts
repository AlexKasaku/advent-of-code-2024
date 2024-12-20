import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Grid, manhattanDistance, Position } from 'utils/grid'
import toSum from 'utils/toSum';

const input = await readInput('day-20')

export type Space = Position & {
  isWall: boolean;
  step?: number;
};

const parseInput = (): { grid: Grid<Space>, start: Position, end: Position } => {
  const values = parseLines(input).map((line) => line.split(''));

  let start: Position | undefined = undefined;
  let end: Position | undefined = undefined;
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === 'S')
      start = { x, y };
    else if (values[y][x] === 'E')
      end = { x, y };

    return {
      x,
      y,
      isWall: values[y][x] === '#',
    };
  });

  return { grid, start: start!, end: end! };
}

const updateGridSteps = (grid: Grid<Space>, start: Position, end: Position): Set<Space> => {

  // Walk to end, increasing step counter as we go. Can assume there's only one path to take each time as
  // this isn't a maze with different routes.
  let currentPosition = grid.get(start)!;
  let stepsOnRoute = new Set<Space>();

  let stepCounter = 0;
  while (!(currentPosition.x == end.x && currentPosition.y == end.y)) {

    stepsOnRoute.add(currentPosition);
    currentPosition.step = stepCounter;
    stepCounter++;

    const validNeighbours = grid.getNeighbours(currentPosition, true).filter(s => !s.isWall && s.step === undefined);

    if (validNeighbours.length > 1) {
      throw 'Route has more than one option!'
    }

    currentPosition = validNeighbours[0];
  }

  // Need to update for last position
  currentPosition.step = stepCounter;
  stepsOnRoute.add(currentPosition);

  return stepsOnRoute;
}

export const part1 = () => {
  const { grid, start, end } = parseInput()

  // Set steps
  const stepsOnRoute = updateGridSteps(grid, start, end);

  const desiredSaving = 100;
  const combos = new Map<number, number>();

  // Now find jumps that would increase steps.
  for (const stepOnRoute of stepsOnRoute) {
    // Go through each step on the route and see where you could leap to, count it if it
    // increases the step counter by at least X

    // Reachable spaces are a neighbour of a neighbour, for the first consider walls
    for (const neighbour of grid.getNeighbours(stepOnRoute, true).filter(s => s.isWall)) {
      // Now get neighbours spaces that aren't the one we started on
      const neighbourSpaces = grid.getNeighbours(neighbour).filter(s => !s.isWall && s != stepOnRoute);

      for (const finalSpace of neighbourSpaces) {
        const saving = (finalSpace.step!) - (stepOnRoute.step!) - 2;

        if (saving > 0)
          combos.set(saving, (combos.get(saving) ?? 0) + 1);
      }
    }

  }

  return combos.entries().map(([saving, count]) => saving >= desiredSaving ? count : 0).reduce(toSum)
}

export const part2 = () => {
  const { grid, start, end } = parseInput()

  // Set steps
  const stepsOnRoute = updateGridSteps(grid, start, end);

  const desiredSaving = 100;
  const combos = new Map<number, number>();

  // Now find jumps that would increase steps.
  for (const stepOnRoute of stepsOnRoute) {
    // Go through each step on the route and see where you could leap to, count it if it
    // increases the step counter by at least X

    // Find all spaces reachable in 20 moves, and the distance they are away. This time only record them 
    // if they will save us the desiredSaving.
    const reachableSpaces = grid.getWithinDistance(stepOnRoute, 20).filter(s => !s.isWall && s != stepOnRoute);

    for (const finalSpace of reachableSpaces) {
      const saving = (finalSpace.step ?? 0) - (stepOnRoute.step ?? 0) - manhattanDistance(stepOnRoute, finalSpace);

      if (saving > 0)
        combos.set(saving, (combos.get(saving) ?? 0) + 1);
    }

  }

  return combos.entries().map(([saving, count]) => saving >= desiredSaving ? count : 0).reduce(toSum)
}
