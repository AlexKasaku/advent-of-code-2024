import { parseLines, readInput } from 'io'
import { debug, log } from 'log'
import type { CardinalDirection, Position } from 'utils/grid'
import { Grid, turnRight } from 'utils/grid'

const input = await readInput('day-06')

type Space = Position & {
  isBlocked: boolean
  visited: boolean
}
type Guard = Position & { facing: CardinalDirection }

const parseInput = (): { grid: Grid<Space>; guard: Guard } => {
  const lines = parseLines(input)
  const values = lines.map((line) => line.split(''))

  const guard: Guard = { x: 0, y: 0, facing: 'N' }
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === '^') {
      guard.x = x
      guard.y = y
    }

    return {
      x,
      y,
      isBlocked: values[y][x] === '#',
      visited: values[y][x] === '^'
    }
  })

  return { grid, guard }
}

const getSpaceChar = ({ x, y, isBlocked, visited }: Space, isGuard: boolean, candidate?: Space) => {
  if (candidate?.x === x && candidate?.y === y) { return '🟥' }
  if (isBlocked) { return '🧱' }
  if (isGuard) { return '🧑' }
  if (visited) { return '🟨' }
  return '⬛'
}

const renderGrid = (grid: Grid<Space>, guard: Guard, candidate?: Space): void => {
  for (const row of grid.Values) { debug(row.reduce((a, b) => a + getSpaceChar(b, b.x == guard.x && b.y == guard.y, candidate), '')) }
  debug()
}

export const part1 = () => {
  const { grid, guard } = parseInput()

  let hasLeftGrid = false

  while (!hasLeftGrid) {
    const spacesToMove = grid.getAllInDirection(guard, guard.facing)
    let turned = false
    for (const space of spacesToMove) {
      if (space?.isBlocked) {
        guard.facing = turnRight(guard.facing)
        turned = true
        break
      }
      space!.visited = true
      guard.x = space!.x
      guard.y = space!.y
    }
    if (!turned) { hasLeftGrid = true }
  }

  return grid.Values.flat().filter((x) => x.visited).length
}

export const part2 = () => {
  let { grid, guard } = parseInput()
  const initialGuardPosition: Guard = { ...guard }

  let hasLeftGrid = false

  // Run grid once to get all candidates for blocking
  while (!hasLeftGrid) {
    const spacesToMove = grid.getAllInDirection(guard, guard.facing)
    let turned = false
    for (const space of spacesToMove) {
      if (space?.isBlocked) {
        guard.facing = turnRight(guard.facing)
        turned = true
        break
      }
      space!.visited = true
      guard.x = space!.x
      guard.y = space!.y
    }
    if (!turned) { hasLeftGrid = true }
  }

  renderGrid(grid, guard)

  // Find candidates for blocking using all visited spaces, except where the guard started
  const blockingCandidates = grid.Values.flat().filter((x) => x.visited && !(x.x === initialGuardPosition.x && x.y === initialGuardPosition.y))

  // Try out blocking candidates and see if it causes a loop
  let causesLoop: number = 0

  // We'll determine a loop by recording each space and facing. If guard is ever back in a space already visited facing same direction, it'll be a loop
  const guardStateToString = ({ x, y, facing }: Guard) => `${x},${y},${facing}`
  let guardStates: Set<string>
  const wasPreviousState = (guard: Guard) => guardStates.has(guardStateToString(guard))
  const addState = (guard: Guard) => guardStates.add(guardStateToString(guard))

  blockingCandidates.forEach((candidate) => {
    // Reset guard state. We no longer need to track visited spaces, as we're just interested in previous states.
    guard = { ...initialGuardPosition }
    hasLeftGrid = false
    guardStates = new Set<string>([...guardStateToString(guard)])

    // Add block
    candidate.isBlocked = true;

    // Run grid to see if we loop
    while (true) {
      const lastUnblockedSpace = grid.findInDirection(guard, guard.facing, (s) => s.isBlocked, true)

      // This direction goes off the grid, it doesn't loop
      if (lastUnblockedSpace === undefined) { break }

      // If guard has been here before in this direction, stop.
      if (wasPreviousState(guard)) {
        causesLoop++
        break
      };

      // We're not off grid and haven't been here before. Turn and move on.

      // Haven't been here before, record it.
      addState(guard)

      guard.facing = turnRight(guard.facing)
      guard.x = lastUnblockedSpace.x
      guard.y = lastUnblockedSpace.y
    }

    // Unblock candidate space ready for next test.
    candidate.isBlocked = false
  })

  return causesLoop
}
