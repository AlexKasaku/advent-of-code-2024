import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import priorityQueue from 'utils/priorityQueue'

const input = await readInput('day-09')

type Block = number
type Disk = (Block | null)[]
type FreeSpaces = number[]
type Data = {
  disk: Disk, spaces: FreeSpaces

}
const parseInput = (): Data => {
  let spaces = [];
  let disk = [];
  let id = 0;

  const diskMap = input.split('');
  for (let x = 0; x < diskMap.length; x += 2) {

    const fileSize = parseInt(diskMap[x]);
    for (let n = 0; n < fileSize; n++)
      disk.push(id);

    id++;

    const emptySpace = parseInt(diskMap[x + 1]);
    for (let n = 0; n < emptySpace; n++) {
      disk.push(null);
      spaces.push(disk.length - 1);
    }
  }

  return { disk, spaces };
}

export const part1 = () => {
  const { disk, spaces } = parseInput()

  debug(disk);
  debug(spaces);

  let diskPullIndex = disk.length - 1;

  const spaceQueue = priorityQueue<number>();
  spaceQueue.insert(...spaces);

  while (spaceQueue.size() > 0) {

    const nextSpace = spaceQueue.dequeue()!;

    if (diskPullIndex == nextSpace)
      break;

    // Move to next block
    while (disk[diskPullIndex] === null)
      diskPullIndex--;

    disk[nextSpace] = disk[diskPullIndex];
    disk[diskPullIndex] = null;

    spaceQueue.insert(diskPullIndex);
  }

  debug(disk);

  let total = 0;
  let pos = 0;

  while (disk[pos] != null) {
    total += pos * disk[pos]!;
    pos++;
  }

  return total;
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return 0;
}
