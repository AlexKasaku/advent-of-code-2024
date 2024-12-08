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

  const getPositionString = ({ x, y }: Position) => `${x},${y}`;
  const antiNodePositions = new Set<string>();

  const addIfValid = ({ x, y }: Position) => {
    if (x >= 0 && x < data.maxBounds.x && y >= 0 && y < data.maxBounds.y) {
      antiNodePositions.add(getPositionString({ x, y }))
    }
  }

  for (const [char, positions] of data.nodeMap.entries()) {

    // Create pairs of all positions. More efficient to do this as we go but lets keep separate for readability
    const pairs = positions.flatMap((a, i) => positions.slice(i + 1).map(b => [a, b]));

    for (const [node1, node2] of pairs) {
      // Each pair creates two antinodes. Calculate them and if they're in the bounds, add them.
      const deltaX = node2.x - node1.x;
      const deltaY = node2.y - node1.y;

      const antiNode1 = { x: node1.x - deltaX, y: node1.y - deltaY };
      const antiNode2 = { x: node2.x + deltaX, y: node2.y + deltaY };

      addIfValid(antiNode1);
      addIfValid(antiNode2);

    }
  }

  return antiNodePositions.size;
}

export const part2 = () => {
  const data = parseInput()

  const getPositionString = ({ x, y }: Position) => `${x},${y}`;
  const antiNodePositions = new Set<string>();

  const addIfValid = ({ x, y }: Position) => {
    if (x >= 0 && x < data.maxBounds.x && y >= 0 && y < data.maxBounds.y) {
      antiNodePositions.add(getPositionString({ x, y }))
    }
  }

  for (const [char, positions] of data.nodeMap.entries()) {

    // Create pairs of all positions. More efficient to do this as we go but lets keep separate for readability
    const pairs = positions.flatMap((a, i) => positions.slice(i + 1).map(b => [a, b]));

    for (const [node1, node2] of pairs) {
      // Each pair creates two antinodes. Calculate them and if they're in the bounds, add them.
      const deltaX = node2.x - node1.x;
      const deltaY = node2.y - node1.y;

      // Find all antiNodes across map

      // Start from node1, go backwards until off grid
      let curX = node1.x, curY = node1.y;
      while (curX >= 0 && curY >= 0 && curX < data.maxBounds.x && curY < data.maxBounds.y) {
        const antiNode = { x: curX, y: curY };
        addIfValid(antiNode);
        curX = antiNode.x - deltaX;
        curY = antiNode.y - deltaY;
      }

      // Restart from node1, go forwards until off grid
      curX = node1.x;
      curY = node1.y;

      while (curX >= 0 && curY >= 0 && curX < data.maxBounds.x && curY < data.maxBounds.y) {
        const antiNode = { x: curX, y: curY };
        addIfValid(antiNode);
        curX = antiNode.x + deltaX;
        curY = antiNode.y + deltaY;
      }

    }
  }

  return antiNodePositions.size;
}
