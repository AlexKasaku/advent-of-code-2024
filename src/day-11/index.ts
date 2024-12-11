import { parseLines, readInput } from 'io'
import { log, debug } from 'log'

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

const renderStones = (firstStone: StoneNode) => {
  let thisStone: StoneNode | undefined = firstStone;
  while (thisStone !== undefined) {
    debug(thisStone.value)
    thisStone = thisStone.next;
  }
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
  const stones = parseInput()

  //debug(stones.first);

  return stones.count;
}
