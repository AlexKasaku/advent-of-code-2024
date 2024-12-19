import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import priorityQueue from 'utils/priorityQueue'

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

export const part1 = () => {
  const { patterns, designs } = parseInput()

  // Stores remainder strings and whether they are possible or not, to save recalculating
  const cachedStates = new Map<string, boolean>();
  let possible = 0;

  type State = {
    remainingAtEachStep: string[];
    remaining: string;
  }

  const isPossible = (remainder: string): boolean => {

    if (remainder.length === 0)
      return true;

    if (cachedStates.has(remainder))
      return cachedStates.get(remainder)!;

    let thisRemainderIsPossible = false;

    for (const pattern of patterns) {
      if (remainder.startsWith(pattern)) {
        const newRemainder = remainder.substring(pattern.length);

        if (isPossible(newRemainder)) {
          thisRemainderIsPossible = true;
          break;
        }
      }
    }

    cachedStates.set(remainder, thisRemainderIsPossible);
    return thisRemainderIsPossible;
  }

  for (const design of designs) {

    if (isPossible(design)) {
      possible++
    }

  }



  return possible;
}

export const part2 = () => {
  const { patterns, designs } = parseInput()
  return 0
}
