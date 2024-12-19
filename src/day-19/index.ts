import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import priorityQueue from 'utils/priorityQueue'
import toSum from 'utils/toSum'

const input = await readInput('day-19')

type Data = {
  patterns: string[],
  designs: string[]
}

const parseInput = (): Data => {
  const groups = input.split('\n\n');

  return {
    patterns: groups[0].split(', ').map(x => x.trim()),
    designs: groups[1].split('\n')
  }
}

// Stores remainder strings and whether they are possible or not, to save recalculating
const cachedStates = new Map<string, number>();

const possibleWays = (remainder: string, patterns: string[]): number => {

  if (remainder.length === 0)
    return 1;

  if (cachedStates.has(remainder)) {
    debug(`Cache hit for ${remainder}`);
    return cachedStates.get(remainder)!;
  }

  let remainingWays = 0;

  for (const pattern of patterns) {
    if (remainder.startsWith(pattern)) {
      const newRemainder = remainder.substring(pattern.length);

      const remainingWaysForNewRemainder = possibleWays(newRemainder, patterns);
      remainingWays += remainingWaysForNewRemainder;
    }
  }

  cachedStates.set(remainder, remainingWays);
  return remainingWays;
}

export const part1 = () => {
  const { patterns, designs } = parseInput()

  return designs.map(d => possibleWays(d, patterns) > 0 ? 1 : 0).map(Number).reduce(toSum);
}

export const part2 = () => {
  const { patterns, designs } = parseInput()

  return designs.map(d => possibleWays(d, patterns)).reduce(toSum);

}
