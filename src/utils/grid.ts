import { createAndInitArray } from './createArray'

export type Position = {
  x: number
  y: number
}

export const allDirections = [
  'N',
  'NE',
  'E',
  'SE',
  'S',
  'SW',
  'W',
  'NW',
] as const
export type Direction = (typeof allDirections)[number]

export const cardinalDirections = ['N', 'E', 'S', 'W'] as const
export type CardinalDirection = (typeof cardinalDirections)[number]

export const turnLeft = (direction: CardinalDirection): CardinalDirection =>
  cardinalDirections[(4 + cardinalDirections.indexOf(direction) - 1) % 4]
export const turnRight = (direction: CardinalDirection): CardinalDirection =>
  cardinalDirections[(4 + cardinalDirections.indexOf(direction) + 1) % 4]

export const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

export class Grid<T> {
  Values: T[][]
  readonly Width: number
  readonly Height: number

  constructor(
    height: number,
    width: number,
    initializationCallback?: (position: Position) => T,
  ) {
    this.Width = width
    this.Height = height

    this.Values = createAndInitArray(
      (y, x) => initializationCallback?.({ x, y }),
      height,
      width,
    )
  }

  getNeighbours = (point: Position, orthagonal: boolean = true) => {
    const neighbours: T[] = []
    this.forEachNeighbour(
      point,
      (value) => {
        neighbours.push(value)
      },
      orthagonal,
    )
    return neighbours
  }

  // Raise a callback for each neighbour to the provided position. Note that if T can be undefined
  // then the callback won't be rasied for that position.
  forEachNeighbour = (
    point: Position,
    callback: (value: T, position: Position) => void,
    orthagonal: boolean = true,
  ) => {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        // Skip non-adjacent and yourself
        if (
          (orthagonal && Math.abs(point.x - x) + Math.abs(point.y - y) > 1)
          || (point.x === x && point.y === y)
        ) { continue }

        if (this.Values?.[y]?.[x]) { callback(this.Values[y][x], { x, y }) }
      }
    }
  }

  getNextInDirection = (
    { x, y }: Position,
    direction: Direction
  ) => {
    const deltaX = direction.includes('W') ? -1 : direction.includes('E') ? 1 : 0
    const deltaY = direction.includes('N') ? -1 : direction.includes('S') ? 1 : 0
    return this.get({ x: x + deltaX, y: y + deltaY })
  }

  getAllInDirection = (
    { x, y }: Position,
    direction: Direction,
    count?: number,
  ) => {
    // Start at the position and keep moving in direction acquiring cells, until we run out of grid.
    const deltaX
      = direction.includes('W') ? -1 : direction.includes('E') ? 1 : 0
    const deltaY
      = direction.includes('N') ? -1 : direction.includes('S') ? 1 : 0

    const values = []
    let curX = x + deltaX; let curY = y + deltaY
    let position: T | undefined = this.get({ x: curX, y: curY })

    while (position !== undefined && (count === undefined || values.length <= count)) {
      values.push(position)

      curX += deltaX
      curY += deltaY
      position = this.get({ x: curX, y: curY })
    }

    return values
  }

  findInDirection = (
    { x, y }: Position,
    direction: Direction,
    predicate: (space: T) => boolean,
    returnSpaceBeforeMatch: boolean
  ): T | undefined => {
    // Start at the position and keep testing in direction until we run out of grid
    // or find space that matches predicate.
    const deltaX = direction.includes('W') ? -1 : direction.includes('E') ? 1 : 0
    const deltaY = direction.includes('N') ? -1 : direction.includes('S') ? 1 : 0

    let curX = x; let curY = y
    let position: T | undefined
    do {
      curX += deltaX
      curY += deltaY

      position = this.get({ x: curX, y: curY })
      if (position !== undefined && predicate(position)) { return returnSpaceBeforeMatch ? this.get({ x: curX - deltaX, y: curY - deltaY }) : position }
    } while (position !== undefined)

    // Failed to find item
    return undefined
  }

  get = ({ x, y }: Position): T | undefined => this.Values[y]?.[x]
  set = ({ x, y }: Position, value: T): void => {
    this.Values[y][x] = value
  }

  getSegment = ({ x, y }: Position, width: number, height: number) =>
    this.Values.slice(y, y + height).map((row) => row.slice(x, x + width))

  getWithinDistance = (pos: Position, maxDistance: number, predicate?: (space: T, distance: number) => boolean): T[] => {
    const within = [];

    // Get bounds, capping at 0 / edge.
    const minY = pos.y - maxDistance < 0 ? 0 : pos.y - maxDistance;
    const maxY = pos.y + maxDistance >= this.Height ? this.Height - 1 : pos.y + maxDistance;
    const minX = pos.x - maxDistance < 0 ? 0 : pos.x - maxDistance;
    const maxX = pos.x + maxDistance >= this.Width ? this.Width - 1 : pos.x + maxDistance;

    for (let curY = minY; curY <= maxY; curY++) {
      for (let curX = minX; curX <= maxX; curX++) {
        const curPos = { x: curX, y: curY };
        const distance = manhattanDistance(pos, curPos);

        if (distance <= maxDistance) {
          const space = this.get(curPos)!;

          if (!predicate || predicate(space, distance))
            within.push(this.get(curPos)!);
        }
      }
    }
    return within;
  }

  updateEachInSegment = (
    { x, y }: Position,
    width: number,
    height: number,
    callback: (value: T) => T,
  ): void => {
    for (let curY = y; curY < y + height; curY++) {
      for (let curX = x; curX < x + width; curX++) { this.Values[curY][curX] = callback(this.Values[curY][curX]) }
    }
  }

  log = () => {
    console.dir(this.Values, { depth: null })
  }
}
