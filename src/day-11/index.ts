import chalk from 'chalk'
import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import toSum from 'utils/toSum'

const input = await readInput('day-11')

type Stones = {
  first: StoneNode;
  count: number;
}
type StoneNode = {
  value: number;
  prev?: StoneNode,
  next?: StoneNode,
}

const parseInput = (): Stones => {
  const [first, ...rest] = input.split(' ').map(Number);

  const firstStone: StoneNode = { value: first }
  let count = 1;
  let currentStone: StoneNode = firstStone;

  for (const remainingValue of rest) {
    const newStone: StoneNode = { value: remainingValue, prev: currentStone };
    currentStone.next = newStone;

    currentStone = newStone;
    count++;
  }

  return { first: firstStone, count }
}

const renderStones = (firstStone: StoneNode, count?: number) => {
  let thisStone: StoneNode | undefined = firstStone;
  let stoneList = "";
  let total = 0;
  while (thisStone !== undefined && (!count || total < count)) {
    stoneList += `${thisStone.value} `;
    thisStone = thisStone.next;
    total++;
  }
  debug(stoneList);
}

export const part1 = () => {
  const stones = parseInput()

  const iterations = 25;

  for (let x = 0; x < iterations; x++) {

    let thisStone: StoneNode | undefined = stones.first;

    // Process each stone in turn
    while (thisStone !== undefined) {
      // Get next stone before we add any more, that's the one we'll move on to next
      let nextStone: StoneNode | undefined = thisStone.next;

      // Decide how to change / split this stone
      if (thisStone.value === 0)
        thisStone.value = 1;
      else if (thisStone.value.toString().length % 2 === 0) {
        // Split the stone
        const valueAsString = thisStone.value.toString();
        const firstHalf = valueAsString.substring(0, valueAsString.length / 2);
        const secondHalf = valueAsString.substring(valueAsString.length / 2);

        // Set current stone to the first half, it keeps it's previous stone reference
        thisStone.value = parseInt(firstHalf);

        // Create new stone to come after
        const newNextStone: StoneNode = { value: parseInt(secondHalf), prev: thisStone, next: nextStone }
        thisStone.next = newNextStone;

        // Also update next stones previous reference
        if (nextStone)
          nextStone.prev = newNextStone;

        // Finally update count
        stones.count += 1;
      }
      else {
        thisStone.value = thisStone.value * 2024;
      }

      // Move on to next
      thisStone = nextStone;
    }
  }

  return stones.count;
}

export const part2 = () => {
  const iterations = 75;

  // Map of stone values to how many we have of them, since list position is unimportant
  const stoneCounts = new Map<number, number>();
  input.split(' ').map(Number).forEach(x => stoneCounts.set(x, (stoneCounts.get(x) ?? 0) + 1))

  for (let x = 0; x < iterations; x++) {
    debug(`Iteration: ${x}. Stones: ${stoneCounts.values().reduce(toSum)}`);

    // Work out how stones will change in this iteration, we apply all at end.
    const stoneDeltas = new Map<number, number>();

    // Process each stone in turn
    for (const [stoneValue, stoneCount] of stoneCounts.entries()) {

      // Decide how to change / split this stone. But instead we manipulate counts
      if (stoneValue === 0) {
        // All these zeroes will become ones, so set that delta.
        stoneDeltas.set(0, (stoneDeltas.get(0) ?? 0) - stoneCount)
        stoneDeltas.set(1, (stoneDeltas.get(1) ?? 0) + stoneCount)
      }
      else if (stoneValue.toString().length % 2 === 0) {
        // Split the stone
        const valueAsString = stoneValue.toString();
        const firstHalf = parseInt(valueAsString.substring(0, valueAsString.length / 2));
        const secondHalf = parseInt(valueAsString.substring(valueAsString.length / 2));

        // We create as many of each of these as we were to split
        stoneDeltas.set(stoneValue, (stoneDeltas.get(stoneValue) ?? 0) - stoneCount)
        stoneDeltas.set(firstHalf, (stoneDeltas.get(firstHalf) ?? 0) + stoneCount)
        stoneDeltas.set(secondHalf, (stoneDeltas.get(secondHalf) ?? 0) + stoneCount)
      }
      else {
        // Multiply by 2024 for all of this count, removing the existing
        stoneDeltas.set(stoneValue, (stoneDeltas.get(stoneValue) ?? 0) - stoneCount)
        stoneDeltas.set(stoneValue * 2024, (stoneDeltas.get(stoneValue * 2024) ?? 0) + stoneCount)
      }
    }

    // Now apply all deltas
    for (const [stoneValue, stoneDelta] of stoneDeltas.entries()) {
      stoneCounts.set(stoneValue, (stoneCounts.get(stoneValue) ?? 0) + stoneDelta)
    }

  }

  return stoneCounts.values().reduce(toSum);
}

// An alternate implementation of part2 that uses recursion and caching instead of the map.
export const part2Alternate = () => {

  const getStoneCountCache = new Map<string, number>();

  const getStoneCount = (stoneValue: number, remainingIterations: number): number => {
    const cacheKey = `${stoneValue}|${remainingIterations}`;

    if (getStoneCountCache.has(cacheKey))
      return getStoneCountCache.get(cacheKey)!;

    let returnValue;

    if (remainingIterations === 0) {
      returnValue = 1;
    }
    else if (stoneValue == 0) {
      returnValue = getStoneCount(1, remainingIterations - 1)
    }
    else if (stoneValue.toString().length % 2 === 0) {
      // Split the stone
      const valueAsString = stoneValue.toString();
      const firstHalf = parseInt(valueAsString.substring(0, valueAsString.length / 2));
      const secondHalf = parseInt(valueAsString.substring(valueAsString.length / 2));

      returnValue = getStoneCount(firstHalf, remainingIterations - 1) + getStoneCount(secondHalf, remainingIterations - 1)
    }
    else {
      returnValue = getStoneCount(stoneValue * 2024, remainingIterations - 1);
    }

    debug(`${cacheKey} = ${returnValue}`);
    getStoneCountCache.set(cacheKey, returnValue);
    return returnValue;
  }

  const iterations = 75;

  return input.split(' ').map(Number).map(x => getStoneCount(x, iterations)).reduce(toSum)
}
