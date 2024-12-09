import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import priorityQueue from 'utils/priorityQueue'

const input = await readInput('day-09')

type Block = { id: number, fileSize: number }
type Disk = (Block | null)[]
type FreeSpaces = number[]
type FreeSpaceChunk = { index: number, size: number }
type Data = {
  disk: Disk, spaces: FreeSpaces, spaceChunks: FreeSpaceChunk[]

}
const parseInput = (): Data => {
  let spaces = [];
  let spaceChunks = [];
  let disk = [];
  let id = 0;

  const diskMap = input.split('');
  for (let x = 0; x < diskMap.length; x += 2) {

    const fileSize = parseInt(diskMap[x]);
    for (let n = 0; n < fileSize; n++)
      disk.push({ id, fileSize });

    id++;

    const emptySpace = parseInt(diskMap[x + 1]);
    spaceChunks.push({ index: disk.length, size: emptySpace });
    for (let n = 0; n < emptySpace; n++) {
      disk.push(null);
      spaces.push(disk.length - 1);
    }
  }

  return { disk, spaces, spaceChunks };
}

export const part1 = () => {
  const { disk, spaces } = parseInput()

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

  let total = 0;
  let pos = 0;

  while (disk[pos] != null) {
    total += pos * disk[pos]!.id;
    pos++;
  }

  return total;
}

const getStartOfNextFile = (disk: Disk, index: number): number => {
  while (disk[index] === null && index > 0)
    index--;

  if (index == 0) return 0;

  return index - disk[index]!.fileSize + 1;
}

export const part2 = () => {
  const { disk, spaces, spaceChunks } = parseInput()

  debug(disk);
  debug(spaces)
  debug(spaceChunks)

  let diskPullIndex = getStartOfNextFile(disk, disk.length - 1);


  while (diskPullIndex > 0) {
    const { id, fileSize } = disk[diskPullIndex]!;
    debug(id);

    const nextChunkThatFitsIndex = spaceChunks.findIndex(chunk => fileSize <= chunk.size);

    if (nextChunkThatFitsIndex === -1) {
      // Can't fit this file, move on
      diskPullIndex = getStartOfNextFile(disk, diskPullIndex - 1);
      continue;
    }

    // Get chunk
    const spaceChunk = spaceChunks[nextChunkThatFitsIndex]

    if (spaceChunk.index >= diskPullIndex) {
      // Don't want to move things forward! We're done
      break;
    }

    debug(`Moving ${id} to ${spaceChunk.index}`)

    // Move file
    for (let x = 0; x < fileSize; x++) {
      disk[spaceChunk.index + x] = disk[diskPullIndex + x];
      disk[diskPullIndex + x] = null;
    }

    // Update chunk
    spaceChunks[nextChunkThatFitsIndex] = { index: spaceChunk.index + fileSize, size: spaceChunk.size - fileSize }

    // Move on
    diskPullIndex = getStartOfNextFile(disk, diskPullIndex - 1);
  }

  let total = 0;
  let pos = 0;

  while (pos < disk.length) {
    total += pos * (disk[pos]?.id ?? 0)
    pos++;
  }

  return total;
}
