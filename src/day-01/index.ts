import { parseLines, readInput } from 'io'

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const input = await readInput('day-01')

export const part1 = () => {
  const lines = parseLines(input)
  
  const list1: number[] = [];
  const list2: number[] = [];
  
  lines.forEach(line => {
    const split = line.split('   ');
    list1.push(parseInt(split[0]));
    list2.push(parseInt(split[1]));
  });

  debug(list1[0]);
  debug(list2[0]);

  list1.sort();
  list2.sort();

  let totalDistance = 0;

  for (let index = 0; index < list1.length; index++) {
    debug(list1[index]);
    debug(list2[index]);
    const diff = Math.abs(list2[index] - list1[index]);
    debug(diff);
    totalDistance += diff;
  }

  return totalDistance
}

export const part2 = () => {
  const lines = parseLines(input)
  // your code goes here
  return lines.length
}
