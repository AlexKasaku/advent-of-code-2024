import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import type { Position } from 'utils/grid'

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

export const part1 = () => {
  const robots = parseInput()

  const seconds = 100, width = 101, height = 103;

  moveRobots(robots, seconds, width, height);

  return calculateSafety(robots, width, height);
}

export const part2 = () => {
  const robots = parseInput()



  return 0
}




