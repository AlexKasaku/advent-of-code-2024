import { parseLines, readInput } from 'io'
import toSum from 'utils/toSum';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const input = await readInput('day-01');

const toNumbers = (line: string): [number, number] => line.split('   ').map(x => parseInt(x)) as [number, number];

export const part1 = () => {
  const lines = parseLines(input)
  
  const leftList: number[] = [];
  const rightList: number[] = [];
  
  lines.map(toNumbers).forEach(([left, right]) => {
    leftList.push(left);
    rightList.push(right);
  });

  leftList.sort();
  rightList.sort();

  const totalDistance = leftList.map((x, i) => Math.abs(x - rightList[i])).reduce(toSum);

  return totalDistance;
}

export const part2 = () => {
  const lines = parseLines(input)
  
  const leftList: number[] = [];
  const rightMap: Map<number, number> = new Map();
  
  lines.map(toNumbers).forEach(([left, right]) => {
    leftList.push(left);
    rightMap.set(right, (rightMap.get(right) ?? 0) + 1);
  });

  const totalSimilarity = leftList.map(x => x * (rightMap.get(x) ?? 0)).reduce(toSum);

  return totalSimilarity;
}
