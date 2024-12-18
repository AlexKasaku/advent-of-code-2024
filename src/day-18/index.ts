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
  positions: Position[];
  steps: number;
};

const getStateKey = ({ position: { x, y } }: State): string => `${x},${y}`;

export const part1 = () => {
  const positions = parseInput()

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

  const grid = buildGrid(positions.slice(0, first), width, height);

  const lowestCostForState = new Map<string, number>();
  const queue = priorityQueue<Route>((a, b) => a.steps <= b.steps);

  queue.insert(
    {
      state: { position: start },
      positions: [],
      steps: 0,
    }
  );

  while (!queue.isEmpty()) {
    const { state, positions, steps } = queue.dequeue()!;
    const { position } = state;

    if (position.x === end.x && position.y === end.y) {
      debug(positions);
      return steps;
    }

    // Have we been to this space before, and was it with a lower value?
    const stateKey = getStateKey(state);
    const previousVisit = lowestCostForState.get(stateKey);
    if (previousVisit !== undefined && previousVisit <= steps) continue;

    // This is new or better visit for this space
    lowestCostForState.set(stateKey, steps);

    // Add movements for all directions, as long as we haven't visited them or they're blocked.
    const visitedPositions = new Set<Position>(positions);
    const unblockedNeighbours = grid.getNeighbours(position, true).filter(s => !s.isBlocked && !visitedPositions.has(s));

    for (const neighbour of unblockedNeighbours) {
      queue.insert({
        state: {
          position: neighbour,
        },
        positions: [...visitedPositions, neighbour],
        steps: steps + 1,
      });
    }
  }

  throw 'Could not reach end'

}

export const part2 = () => {
  const lines = parseInput()
  return 0;
}
