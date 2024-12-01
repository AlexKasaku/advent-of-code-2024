import { parseLines, readInput } from 'io'

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const input = await readInput('day-01');

export const part1 = () => {
  const lines = parseLines(input)
  
  const list1: number[] = [];
  const list2: number[] = [];
  
  lines.forEach(line => {
    const split = line.split('   ');
    list1.push(parseInt(split[0]));
    list2.push(parseInt(split[1]));
  });

  list1.sort();
  list2.sort();

  let totalDistance = 0;

  for (let index = 0; index < list1.length; index++) {
    const diff = Math.abs(list2[index] - list1[index]);
    totalDistance += diff;
  }

  return totalDistance
}

export const part2 = () => {
  const lines = parseLines(input)
  
  const list1: number[] = [];
  const rightMap: Map<number, number> = new Map();
  
  lines.forEach(line => {
    const split = line.split('   ');
    list1.push(parseInt(split[0]));
    
    const rightNum = parseInt(split[1]);
    if (rightMap.has(rightNum))
      rightMap.set(rightNum, rightMap.get(rightNum)! + 1);
    else
      rightMap.set(rightNum, 1)
  });

  let totalSimilarity = 0;

  for (let index = 0; index < list1.length; index++) {
    const similar = list1[index] * (rightMap.get(list1[index]) ?? 0);
    totalSimilarity += similar;
  }

  return totalSimilarity;
}
