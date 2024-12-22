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
  const iterations = 2;

  for (const line of lines) {

    debug(line);
    const numerical = parseInt(line.substring(0, 3));
    const moves = getMovementPairs(line);

    // Get first dir moves
    let dirMoves = '';
    for (const move of moves) {
      dirMoves += (numbersMap.get(move)?.[0] ?? '') + 'A';
    }

    let finalDirMoves = dirMoves;
    for (let i = 0; i < iterations; i++) {
      finalDirMoves = expandMoves(finalDirMoves);
    }

    debug(`${finalDirMoves} - ${finalDirMoves.length}`);

    total += numerical * finalDirMoves.length;
  }

  return total;
}

const getMoveCountCache = new Map<string, number>();

const calculateMoves = (move: string, iterations: number) => {

  const cacheKey = `${move}|${iterations}`;

  if (getMoveCountCache.has(cacheKey))
    return getMoveCountCache.get(cacheKey)!;

  let requiredMoves = 0;

  const moves = getMovementPairs((dirsMap.get(move)?.[0] ?? '') + 'A');

  for (const move of moves)
    if (iterations > 1)
      requiredMoves += calculateMoves(move, iterations - 1);
    else
      requiredMoves = moves.length;

  getMoveCountCache.set(cacheKey, requiredMoves);
  return requiredMoves;
}

export const part2 = () => {
  const lines = parseInput()

  let total = 0;
  const iterations = 25;

  for (const line of lines) {

    debug(line);

    const numerical = parseInt(line.substring(0, 3));
    const moves = getMovementPairs(line);

    // Get first dir moves
    let dirMoves: string[] = [];
    for (const move of moves) {
      dirMoves.push(...getMovementPairs((numbersMap.get(move)?.[0] ?? '') + 'A'));
    }

    // Now need to expand dirMoves 25 times. Except we just want a count of the resulting size,
    // not all of the moves itself.
    let requiredMoves = 0;
    for (const move of dirMoves)
      requiredMoves += calculateMoves(move, iterations);

    total += numerical * requiredMoves;
    debug(`${line} = ${numerical} * ${requiredMoves}`);

  }

  return total;
}