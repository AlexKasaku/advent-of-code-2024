import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import type { Position } from 'utils/grid'
import { PNG } from 'pngjs'
import { createWriteStream, writeFileSync } from 'fs'

const input = await readInput('day-14')

type Robot = { position: Position, velocity: Position }

const parseInput = (): Robot[] => {
  const regex = /-?(\d+)/g;

  return parseLines(input).map(line => [...line.matchAll(regex)].map(match => parseInt(match[0]))).map(values => ({
    position: { x: values[0], y: values[1] },
    velocity: { x: values[2], y: values[3] },
  }));

}

const moveRobots = (robots: Robot[], iterations: number, maxWidth: number, maxHeight: number) => {
  for (const robot of robots) {
    robot.position.x = (robot.position.x + (robot.velocity.x * iterations)) % maxWidth;
    robot.position.y = (robot.position.y + (robot.velocity.y * iterations)) % maxHeight;

    if (robot.position.x < 0) robot.position.x += maxWidth;
    if (robot.position.y < 0) robot.position.y += maxHeight;
  }
}

const calculateSafety = (robots: Robot[], width: number, height: number) => {

  let topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0;

  const middleX = Math.floor(width / 2);
  const middleY = Math.floor(height / 2);

  for (const robot of robots) {
    if (robot.position.x < middleX) {
      if (robot.position.y < middleY) {
        topLeft++
      } else if (robot.position.y > middleY) {
        bottomLeft++
      }
    }
    else if (robot.position.x > middleX) {
      if (robot.position.y < middleY) {
        topRight++
      } else if (robot.position.y > middleY) {
        bottomRight++
      }
    }
  }

  return topLeft * topRight * bottomLeft * bottomRight;
}

const posToString = (position: Position): string => `${position.x},${position.y}`

const render = (robots: Robot[], width: number, height: number) => {

  const uniquePositions = new Set<string>();
  for (const robot of robots)
    uniquePositions.add(posToString(robot.position))

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      line += uniquePositions.has(posToString({ x, y })) ? "X" : "."
    }
    log(line);
  }
}

const generateImage = (robots: Robot[], elapsed: number, width: number, height: number) => {

  let png = new PNG({ width, height });

  const uniquePositions = new Set<string>();
  for (const robot of robots)
    uniquePositions.add(posToString(robot.position))

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (png.width * y + x) << 2;

      const hasRobot = uniquePositions.has(posToString({ x, y }));

      png.data[idx] = hasRobot ? 255 : 0; // red
      png.data[idx + 1] = hasRobot ? 255 : 0; // green
      png.data[idx + 2] = hasRobot ? 255 : 0; // blue
      png.data[idx + 3] = 255; // alpha (0 is transparent)
    }
  }

  const buff = PNG.sync.write(png);
  writeFileSync(`src/day-14/outputs/${elapsed}.png`, buff.buffer);
}

export const part1 = () => {
  const robots = parseInput()

  const seconds = 100, width = 101, height = 103;

  moveRobots(robots, seconds, width, height);

  return calculateSafety(robots, width, height);
}

export const part2 = () => {
  const robots = parseInput()

  const startFrom = 6800, seconds = 1, width = 101, height = 103;
  moveRobots(robots, startFrom, width, height);

  let elapsed = startFrom;
  while (elapsed < 7500) {
    moveRobots(robots, seconds, width, height);
    elapsed += seconds;

    generateImage(robots, elapsed, width, height);

    log(elapsed);
  }

  return 0
}






