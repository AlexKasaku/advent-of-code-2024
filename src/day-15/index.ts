import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Position, Grid, CardinalDirection } from 'utils/grid';

const input = await readInput('day-15')


type Space = Position & {
  isWall: boolean;
  isBox: boolean;
}
type Data = {
  grid: Grid<Space>,
  robot: Position,
  commands: CardinalDirection[]
}

const parseInput = (): Data => {
  const inputGroups = input.split('\n\n');

  const values = inputGroups[0].split('\n').map((line) => line.split(''))

  const robot: Position = { x: 0, y: 0 }
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === '@') {
      robot.x = x
      robot.y = y
    }

    return {
      x,
      y,
      isWall: values[y][x] === '#',
      isBox: values[y][x] === 'O'
    }
  });

  const commands: CardinalDirection[] = inputGroups[1].replaceAll('\n', '').split('').map(c => {
    switch (c) {
      case '<': return 'W';
      case '^': return 'N';
      case '>': return 'E';
      case 'v': return 'S';
    }
    throw 'Unsupported direction'
  })

  return {
    grid,
    robot,
    commands
  }
}

const getSpaceChar = ({ x, y, isWall, isBox }: Space, isRobot: boolean) => {
  if (isWall) { return '🧱' }
  if (isRobot) { return '🤖' }
  if (isBox) { return '📦' }
  return '⚫'
}

const renderGrid = (grid: Grid<Space>, robot: Position): void => {
  for (const row of grid.Values) { debug(row.reduce((a, b) => a + getSpaceChar(b, b.x === robot.x && b.y === robot.y), '')) }
  debug()
}

function moveRobot(grid: Grid<Space>, robot: Position, command: CardinalDirection) {

  // Attempt to move the robot, but must not move if blocked
  const spacesAhead = grid.getAllInDirection(robot, command);

  // Assume we are blocked, keep moving until we hit a wall or find a space. 
  // If we find a space we know we can move and boxes in our way will be able to shift
  let spaceAheadIsBlocked = true;
  let nextEmptySpace;
  for (let i = 0; i < spacesAhead.length; i++) {
    if (!spacesAhead[i].isWall && !spacesAhead[i].isBox) {
      spaceAheadIsBlocked = false;
      nextEmptySpace = spacesAhead[i];
      break;
    }
    if (spacesAhead[i].isWall) {
      break;
    }
  }

  // No space to move, blocked.
  if (spaceAheadIsBlocked) {
    debug('BLOCKED');
    return;
  }

  // We can move, so move.
  robot.x = spacesAhead[0].x;
  robot.y = spacesAhead[0].y;

  // Now shift all boxes along one. Keep moving until a box finds a space
  let currentSpace = spacesAhead.shift()!;
  let movingBox = false;
  while (currentSpace != nextEmptySpace) {
    if (currentSpace.isBox) {
      // If we're carrying a box over, leave this as isBox. Otherwise, empty it.
      if (!movingBox)
        currentSpace.isBox = false;
      movingBox = true;
    } else if (movingBox) {
      currentSpace.isBox = true;
      movingBox = false;
    }
    currentSpace = spacesAhead.shift()!;
  }

  // Drop box in final space if still carrying
  if (movingBox)
    currentSpace.isBox = true;

  // Move complete
}

export const part1 = () => {
  const { grid, robot, commands } = parseInput()

  renderGrid(grid, robot);

  for (const command of commands) {
    debug(command);
    moveRobot(grid, robot, command);
    renderGrid(grid, robot);
  }


  return 0
}

export const part2 = () => {
  const data = parseInput()
  return 0
}


