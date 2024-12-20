import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Grid, Position } from 'utils/grid'

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

const updateGridSteps = (grid: Grid<Space>, start: Position, end: Position): void => {

  // Walk to end, increasing step counter as we go. Can assume there's only one path to take each time as
  // this isn't a maze with different routes.
  let currentPosition = grid.get(start)!;

  let stepCounter = 0;
  while (!(currentPosition.x == end.x && currentPosition.y == end.y)) {

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

}

export const part1 = () => {
  const { grid, start, end } = parseInput()

  updateGridSteps(grid, start, end);

  debug(grid.Values)
  debug(grid.get(end)!.step)

  return 0
}

export const part2 = () => {
  const { grid, start, end } = parseInput()
  return 0
}
