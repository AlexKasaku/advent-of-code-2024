import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { CardinalDirection, Grid, Position, turnRight } from 'utils/grid'

const input = await readInput('day-06')

type Space = Position & {
  isBlocked: boolean
  visited: boolean
}

const parseInput = (): { grid: Grid<Space>, guard: Position, facing: CardinalDirection } => {
  const lines = parseLines(input);
  const values = lines.map((line) => line.split(''));

  let guard: Position;
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === '^')
      guard = {x,y};

    return {
      x,
      y,
      isBlocked: values[y][x] === '#',
      visited: values[y][x] === '^'
    }
  });
  const facing: CardinalDirection = 'N'

  return {grid, guard: guard!, facing};
}

const getSpaceChar = ({isBlocked, visited}: Space, isGuard: boolean) => {
  if (isBlocked) return '🧱';
  if (isGuard) return '🧑';
  if (visited) return '🟨';
  return '⬛';
};

const renderGrid = (grid: Grid<Space>, guard: Position): void => {
  for (const row of grid.Values)
    console.log(row.reduce((a, b) => a + getSpaceChar(b, b.x == guard.x && b.y == guard.y), ''));
  console.log();
};

export const part1 = () => {
  let { grid, guard, facing } = parseInput()

  renderGrid(grid, guard);

  let hasLeftGrid = false;

  while (!hasLeftGrid) {

    const spacesToMove = grid.getAllInDirection(guard, facing);
    let turned = false;
    for(const space of spacesToMove) {
      if (space?.isBlocked) {
        facing = turnRight(facing);
        turned = true;
        break;
      }
      space!.visited = true;
      guard = {x: space!.x, y: space!.y}
    }
    if (!turned)
      hasLeftGrid = true;
  }
  
  renderGrid(grid, guard);

  return grid.Values.flat().filter(x => x.visited).length;
}

export const part2 = () => {
  const { grid, guard, facing } = parseInput()

  return 0
}
