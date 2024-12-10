import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Position, Grid } from 'utils/grid';

const input = await readInput('day-10')

type Space = Position & {
  value: number;
}

const parseInput = () => {
  const lines = parseLines(input)
  const values = lines.map((line) => line.split(''))

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    return {
      x,
      y,
      value: parseInt(values[y][x])
    }
  })
}

type VisitState = { current: Space; start: Position }

export const part1 = () => {
  const grid = parseInput()

  let routeToString = (start: Position, end: Position) => `${start.x},${start.y}->${end.x},${end.y}`;
  let trailheadRoutes: Set<string> = new Set<string>();
  let states: VisitState[] = [];

  // Add the trail heads
  grid.Values.flat().filter(x => x.value == 0).forEach(s => states.push({ current: s, start: { x: s.x, y: s.y } }));

  // Exhaust states to find all reachable peaks
  while (states.length > 0) {
    const { current, start } = states.pop()!;
    const neighbours = grid.getNeighbours(current, true);

    for (const neighbour of neighbours) {
      if (neighbour.value == current.value + 1) {
        if (neighbour.value === 9) {
          // Found a peak!
          trailheadRoutes.add(routeToString(start, neighbour));
        } else {
          // Not a peak, push to states and carry on
          states.push({ current: neighbour, start });
        }
      }
    }
  }

  debug(trailheadRoutes);

  return trailheadRoutes.size;
}

export const part2 = () => {
  const grid = parseInput()

  return 0
}
