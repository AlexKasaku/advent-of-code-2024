import { parseLines, readInput } from 'io'
import { log, debug } from 'log'

const input = await readInput('day-21')
const numberMapInput = await readInput('day-21', 'nums_map');
const dirsMapInput = await readInput('day-21', 'dirs_map');

const buildNumbersMap = (): Map<string, string[]> => {

  const map = new Map<string, string[]>();

  numberMapInput.split('\n').forEach(line => {
    const lineParts = line.split(' ');
    const mapAB = lineParts.shift()!;
    map.set(mapAB, lineParts);
  })

  return map;
}

const buildDirsMap = (): Map<string, string[]> => {

  const map = new Map<string, string[]>();

  dirsMapInput.split('\n').forEach(line => {
    const lineParts = line.split(' ');
    const mapAB = lineParts.shift()!;
    map.set(mapAB, lineParts);
  })

  return map;
}

const numbersMap = buildNumbersMap();
const dirsMap = buildDirsMap();

const getMovementPairs = (line: string) => ['A', ...line.split('')].slice(0, line.length).map((x, i, a) => a[i] + (a[i + 1] ?? 'A'));

const parseInput = () => {
  return parseLines(input)
}

const expandMoves = (moves: string): string => {
  let expandedMoves = '';
  for (const move of getMovementPairs(moves)) {
    expandedMoves += (dirsMap.get(move)?.[0] ?? '') + 'A';
  }
  return expandedMoves;
}

export const part1 = () => {
  const lines = parseInput()

  let total = 0;
  for (const line of lines) {

    const numerical = parseInt(line.substring(0, 3));
    const moves = getMovementPairs(line);

    let dirMoves = '';
    for (const move of moves) {
      dirMoves += (numbersMap.get(move)?.[0] ?? '') + 'A';
    }

    let dirMoves2 = expandMoves(dirMoves);
    let dirMoves3 = expandMoves(dirMoves2);

    debug(`${dirMoves3} - ${dirMoves3.length}`);

    total += numerical * dirMoves3.length;
  }

  return total;
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return lines.length
}
