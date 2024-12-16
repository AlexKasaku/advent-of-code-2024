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
  cost: number;
};

type RouteWithPositions = {
  state: State;
  positions: Position[];  // Only used if we want to render route
  cost: number;
};

const getStateKey = ({
  position: { x, y },
  direction,
}: State): string => `${x},${y},${direction}`;

export const part1 = () => {
  const { grid, start, end } = parseInput()

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
      return cost;
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
        cost: cost + 1001,
      });
  }

  throw 'Could not find route to end'
}

export const part2 = () => {
  const { grid, start, end } = parseInput()

  let bestRoute: number | undefined = undefined;
  let bestPostions = new Set<Position>();
  const lowestCostForState = new Map<string, number>();
  const queue = priorityQueue<RouteWithPositions>((a, b) => a.cost <= b.cost);

  queue.insert(
    {
      state: { position: start, direction: 'E' },
      positions: [start],
      cost: 0,
    }
  );

  while (!queue.isEmpty()) {
    const { state, positions, cost } = queue.dequeue()!;
    const { position, direction } = state;

    if (position.x === end.x && position.y === end.y) {
      // Reached end! We don't want to stop as we want to find all routes to end. As we will carry on
      // we will find all routes (not just best ones), but we do find best ones *first*, so we just need
      // to keep a note of the best route cost and ignore others.

      // Add all the unique positions
      if (!bestRoute || cost <= bestRoute) {
        bestRoute = cost;
        bestPostions = new Set<Position>([...bestPostions, ...positions]);
        debug(`Reached end with cost ${cost}`);
      }
    }

    // Have we been to this space before, and was it with a lower value? We still need to check it if 
    // we reached here with the same cost as we need to consider all routes.
    const stateKey = getStateKey(state);
    const previousVisit = lowestCostForState.get(stateKey);
    if (previousVisit !== undefined && previousVisit < cost) continue;

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
        positions: [...positions, nextSpaceAhead],
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
        positions: [...positions, nextSpaceLeft],
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
        positions: [...positions, nextSpaceRight],
        cost: cost + 1001,
      });
  }

  return bestPostions.size;
}
