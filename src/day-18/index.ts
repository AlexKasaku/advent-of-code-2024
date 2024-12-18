import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Position, Grid } from 'utils/grid';
import priorityQueue from 'utils/priorityQueue';

const input = await readInput('day-18')

const parseInput = (): Position[] => {
  return parseLines(input).map(line => {
    const [x, y] = line.split(',');
    return { x: parseInt(x), y: parseInt(y) };
  })
}

type Space = Position & {
  isBlocked: boolean;
}

const buildGrid = (bytes: Position[], width: number, height: number) => {

  return new Grid<Space>(height, width, (({ x, y }) => ({
    x,
    y,
    isBlocked: bytes.findIndex(b => b.x == x && b.y == y) > -1
  })))
}

type State = {
  position: Position;
};

type Route = {
  state: State;
  positions: Set<Position>;
  steps: number;
};

const getStateKey = ({ position: { x, y } }: State): string => `${x},${y}`;

// Example setings
// const first = 12;
// const width = 7;
// const height = 7;
// const start = { x: 0, y: 0 };
// const end = { x: 6, y: 6 };

// Input setings
const first = 1024;
const width = 71;
const height = 71;
const start = { x: 0, y: 0 };
const end = { x: 70, y: 70 };

const routeToEnd = (grid: Grid<Space>, start: { x: number; y: number; }, end: { x: number; y: number; }) => {
  const lowestCostForState = new Map<string, number>();
  const queue = priorityQueue<Route>((a, b) => a.steps <= b.steps);

  queue.insert(
    {
      state: { position: start },
      positions: new Set<Position>(),
      steps: 0,
    }
  );

  while (!queue.isEmpty()) {
    const { state, positions, steps } = queue.dequeue()!;
    const { position } = state;

    if (position.x === end.x && position.y === end.y) {
      return positions;
    }

    // Have we been to this space before, and was it with a lower value?
    const stateKey = getStateKey(state);
    const previousVisit = lowestCostForState.get(stateKey);
    if (previousVisit !== undefined && previousVisit <= steps) continue;

    // This is new or better visit for this space
    lowestCostForState.set(stateKey, steps);

    // Add movements for all directions, as long as we haven't visited them or they're blocked.
    const unblockedNeighbours = grid.getNeighbours(position, true).filter(s => !s.isBlocked && !positions.has(s));

    for (const neighbour of unblockedNeighbours) {
      const newPositions = new Set<Position>(positions);
      newPositions.add(neighbour);

      queue.insert({
        state: {
          position: neighbour,
        },
        positions: newPositions,
        steps: steps + 1,
      });
    }
  }
  return undefined;
}

export const part1 = () => {
  const positions = parseInput()
  const grid = buildGrid(positions.slice(0, first), width, height);

  const route = routeToEnd(grid, start, end)!;

  return route!.size;
}

export const part2 = () => {
  const positions = parseInput()
  const grid = buildGrid(positions.slice(0, first), width, height);

  const remainingBytes = positions.slice(first);

  for (const byte of remainingBytes) {

    // Block off the next byte
    debug(byte);
    grid.get(byte)!.isBlocked = true;

    // Try and reach end
    const route = routeToEnd(grid, start, end)!;

    if (!route)
      return `${byte.x},${byte.y}`;

  }

  throw 'Unable to find byte that blocks'
}
