import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { CardinalDirection, Position, Grid, turnLeft, turnRight } from 'utils/grid';
import priorityQueue from 'utils/priorityQueue';

const input = await readInput('day-16')

export type Space = Position & {
  char: string;
  isWall: boolean;
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
      char: values[y][x],
      isWall: values[y][x] === '#',
    };
  });

  return { grid, start: start!, end: end! };
}

type State = {
  position: Position;
  direction: CardinalDirection;
};

type Route = {
  state: State;
  // positions: Position[];  // Only used if we want to render route
  cost: number;
};

const getStateKey = ({
  position: { x, y },
  direction,
}: State): string => `${x},${y},${direction}`;

export const part1 = () => {
  const { grid, start, end } = parseInput()

  debug(start);
  debug(end);

  const lowestCostForState = new Map<string, number>();
  const queue = priorityQueue<Route>((a, b) => a.cost <= b.cost);

  queue.insert(
    {
      state: { position: start, direction: 'E' },
      cost: 0,
    }
  );

  while (!queue.isEmpty()) {
    const { state, cost } = queue.dequeue()!;
    const { position, direction } = state;

    if (position.x === end.x && position.y === end.y) {
      // Reached end!
      debug(`Reached end with cost ${cost}`);
      break;
    }

    // Have we been to this space before, and was it with a lower value?
    const stateKey = getStateKey(state);
    const previousVisit = lowestCostForState.get(stateKey);
    if (previousVisit !== undefined && previousVisit <= cost) continue;

    // This is new or better visit for this space
    lowestCostForState.set(stateKey, cost);

    // Get routes for straight on, or turning left and right. Turning back on self will never be quicker.

    // Straight ahead
    const nextSpaceAhead = grid.getNextInDirection(position, direction);

    if (nextSpaceAhead && !nextSpaceAhead.isWall)
      queue.insert({
        state: {
          position: nextSpaceAhead,
          direction: state.direction,
        },
        //positions: [...positions, nextSpaceAhead],
        cost: cost + 1,
      });

    // Turn left
    const directionToLeft = turnLeft(state.direction);
    const nextSpaceLeft = grid.getNextInDirection(position, directionToLeft);

    if (nextSpaceLeft && !nextSpaceLeft.isWall)
      queue.insert({
        state: {
          position: nextSpaceLeft,
          direction: directionToLeft,
        },
        //positions: [...positions, nextSpaceAhead],
        cost: cost + 1001,
      });

    // Turn right
    const directionToRight = turnRight(state.direction);
    const nextSpaceRight = grid.getNextInDirection(position, directionToRight);

    if (nextSpaceRight && !nextSpaceRight.isWall)
      queue.insert({
        state: {
          position: nextSpaceRight,
          direction: directionToRight,
        },
        //positions: [...positions, nextSpaceAhead],
        cost: cost + 1001,
      });
  }

  return 0;
}

// export const part2 = () => {
//   const lines = parseInput()
//   // your code goes here
//   return lines.length
// }
