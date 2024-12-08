import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import type { Position } from 'utils/grid'

const input = await readInput('day-08')

type Data = { nodeMap: NodeMap, maxBounds: Position }
type NodeMap = Map<string, Position[]>;

const parseInput = (): Data => {
  const lines = parseLines(input)
  const values = lines.map((line) => line.split(''))

  const maxY = values.length;
  const maxX = values[0].length

  const nodeMap = new Map<string, Position[]>;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const char = values[y][x];
      if (char !== '.')
        nodeMap.set(char, [...(nodeMap.get(char) ?? []), { x, y }])
    }
  }

  return {
    nodeMap, maxBounds: { x: maxX, y: maxY }
  };
}

export const part1 = () => {
  const data = parseInput()

  debug(data.nodeMap);

  return 0;
}

export const part2 = () => {
  const data = parseInput()
  // your code goes here
  return 0;
}
