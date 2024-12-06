import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { CardinalDirection, Grid, Position, turnRight } from 'utils/grid'

const input = await readInput('day-06')

type Space = Position & {
  isBlocked: boolean
  visited: boolean
}
type Guard = Position & { facing: CardinalDirection };

const parseInput = (): { grid: Grid<Space>, guard: Guard } => {
  const lines = parseLines(input);
  const values = lines.map((line) => line.split(''));

  let guard: Guard = { x: 0, y: 0, facing: 'N'};
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === '^')
    {
      guard.x = x;
      guard.y = y;
    }

    return {
      x,
      y,
      isBlocked: values[y][x] === '#',
      visited: values[y][x] === '^'
    }
  });

  return {grid, guard};
}

const getSpaceChar = ({x, y, isBlocked, visited}: Space, isGuard: boolean, candidate?: Space) => {
  if (candidate?.x === x && candidate?.y === y) return '🟥';
  if (isBlocked) return '🧱';
  if (isGuard) return '🧑';
  if (visited) return '🟨';
  return '⬛';
};

const renderGrid = (grid: Grid<Space>, guard: Guard, candidate?: Space): void => {
  for (const row of grid.Values)
    debug(row.reduce((a, b) => a + getSpaceChar(b, b.x == guard.x && b.y == guard.y, candidate), ''));
  debug();
};

export const part1 = () => {
  let { grid, guard } = parseInput()

  let hasLeftGrid = false;

  while (!hasLeftGrid) {

    const spacesToMove = grid.getAllInDirection(guard, guard.facing);
    let turned = false;
    for(const space of spacesToMove) {
      if (space?.isBlocked) {
        guard.facing = turnRight(guard.facing);
        turned = true;
        break;
      }
      space!.visited = true;
      guard.x = space!.x;
      guard.y = space!.y;
    }
    if (!turned)
      hasLeftGrid = true;
  }
  
  return grid.Values.flat().filter(x => x.visited).length;
}

export const part2 = () => {
  let { grid, guard } = parseInput()  
  const initialGuardPosition: Guard = {...guard};

  let hasLeftGrid = false;

  // Run grid once to get all candidates for blocking
  while (!hasLeftGrid) {

    const spacesToMove = grid.getAllInDirection(guard, guard.facing);
    let turned = false;
    for(const space of spacesToMove) {      
      if (space?.isBlocked) {
        guard.facing = turnRight(guard.facing);
        turned = true;
        break;
      }      
      space!.visited = true;
      guard.x = space!.x;
      guard.y = space!.y;
    }
    if (!turned)
      hasLeftGrid = true;
  }
  
  renderGrid( grid, guard );

  // Find candidates for blocking using all visited spaces, except where the guard started
  const blockingCandidates = grid.Values.flat().filter(x => x.visited && !(x.x === initialGuardPosition.x && x.y === initialGuardPosition.y));

  // Try out blocking candidates and see if it causes a loop
  let causesLoop: Space[] = [];

  // We'll determine a loop by recording each space and facing. If guard is ever back in a space already visited facing same direction, it'll be a loop
  const guardStateToString = ({x,y,facing}: Guard) => `${x},${y},${facing}`;

  blockingCandidates.forEach( candidate => {

    // Reset visit state and guard state
    grid.Values.flat().forEach(space => space.visited = false);
    guard = {...initialGuardPosition};
    hasLeftGrid = false;

    // Set initial states
    const wasPreviousState = ( guard: Guard ) => guardStates.has( guardStateToString(guard) );
    const addState = ( guard: Guard ) => guardStates.add( guardStateToString(guard) );
    const guardStates = new Set<string>([...guardStateToString(guard)]);

    // Add block
    candidate.isBlocked = true;

    // Run grid to see if we loop
    while (!hasLeftGrid) {
      const spacesToMove = grid.getAllInDirection(guard, guard.facing);
      let turned = false;
      for(const space of spacesToMove) {
        // Have we been here before?
        if (wasPreviousState(guard)) {

          //renderGrid(grid, guard, candidate);
          //debug(`Space x = ${candidate.x}, y = ${candidate.y} will cause a loop when guard is at x = ${guard.x}, y = ${guard.y}`);
          causesLoop.push(candidate);

          // Unblock candidate space
          candidate.isBlocked = false;

          // Break right out of candidate test
          return;
        };

        // Haven't been here before, record it.
        addState(guard);

        // Carry on moving
        if (space?.isBlocked) {
          guard.facing = turnRight(guard.facing);
          turned = true;
          break;
        }
        space!.visited = true;
        guard.x = space!.x;
        guard.y = space!.y;
      }

      if (!turned)
        hasLeftGrid = true;
    }

    //renderGrid(grid, guard, candidate);

    // Unblock candidate space
    candidate.isBlocked = false;

    // Left grid, so let's move on to next candidate
  })

  debug(causesLoop);

  return causesLoop.length;
}
