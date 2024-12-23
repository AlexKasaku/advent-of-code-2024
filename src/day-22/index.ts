import { parseLines, readInput } from 'io'
import { debug } from 'log';
import { bitwiseConcatBy } from 'utils/bitwiseConcat';

const input = await readInput('day-22')

const parseInput = (): number[] => {
  return parseLines(input).map(Number);
}

const mixAndPrune = (value1: number, value2: number) => {
  return (value1 ^ value2) & 16777215;  // 2^24 - 1, e.g. 11111111111111111111111
}

const getNextValue = (value: number) => {
  let result = value;
  result = mixAndPrune(result << 6, result); // Shift left 6 = * 64
  result = mixAndPrune(result >> 5, result); // Shift right 5 = / 32 and trunc
  result = mixAndPrune(result << 11, result); // Shift left 11 = * 2024
  return result;
}

export const createLoopArray = () => {
  let result = [1];
  let iterations = 16777214;
  let x = 1;

  for (let i = 0; i < iterations; i++) {
    x = getNextValue(x);
    result.push(x % 10);
  }

  return result;
}

export const part1 = () => {
  const values = parseInput()

  let total = 0;
  let iterations = 2000;

  for (const value of values) {
    let x = value;

    for (let i = 0; i < iterations; i++) {
      x = getNextValue(x);
    }

    total += x;
  }
  return total;
}

export const part2 = () => {
  const values = parseInput()

  // Stores how many times a given sequence appears in the list
  const sequenceTotals = new Map<number, number>();

  let iterations = 2000;

  for (const value of values) {

    const sequencesSeen = new Set<number>();

    let values = [value % 10];
    let x = value;

    for (let i = 0; i < iterations; i++) {
      x = getNextValue(x);
      const newValue = x % 10;
      values.push(newValue);

      if (values.length > 4) {

        // Represent the 4 sequence values as a unique single number by bit shifting. This will be much faster for lookups
        // than strings. Rather than deal with negative numbers we can add on 16.
        const sequence = bitwiseConcatBy(5,
          values[values.length - 4] - values[values.length - 5] + 16,
          values[values.length - 3] - values[values.length - 4] + 16,
          values[values.length - 2] - values[values.length - 3] + 16,
          values[values.length - 1] - values[values.length - 2] + 16
        );

        // If first time seeing this sequence
        if (!sequencesSeen.has(sequence)) {
          sequencesSeen.add(sequence);
          sequenceTotals.set(sequence, (sequenceTotals.get(sequence) ?? 0) + newValue);
        }
      }
    }
  }

  let highest = 0;
  sequenceTotals.entries().forEach(([seq, value]) => {
    if (value > highest)
      highest = value;
  });

  return highest;
}


// Notes:

// PNG will loop after 16777215 iterations.
// So all numbers are part of the same circular sequence, representing 2000 digits of it.
// But digits sequence will repeat much more often, so how helpful is this?