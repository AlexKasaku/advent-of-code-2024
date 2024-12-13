import { parseGroups, parseLines, readInput } from 'io'
import { log, debug } from 'log'

const input = await readInput('day-13')

type Machine = {
  buttonA: { x: number, y: number },
  buttonB: { x: number, y: number }
  prize: { x: number, y: number }
}

const parseInput = (): Machine[] => {
  return input.split('\n\n').map(group => {

    const regex = /Button A: X\+(\d+), Y\+(\d+)\s+Button B: X\+(\d+), Y\+(\d+)\s+Prize: X=(\d+), Y=(\d+)/;
    const matches = group.match(regex)!.slice(1, 7).map(Number);

    return {
      buttonA: { x: matches[0], y: matches[1] },
      buttonB: { x: matches[2], y: matches[3] },
      prize: { x: matches[4], y: matches[5] },
    }

  })
}

export const part1 = () => {
  const machines = parseInput()

  let total = 0;

  for (const machine of machines) {
    let cheapest = 401;

    for (let a = 0; a < 100; a++) {
      for (let b = 0; b < 100; b++) {
        const cost = a * 3 + b;

        if (cost > cheapest)
          continue

        if ((a * machine.buttonA.x + b * machine.buttonB.x == machine.prize.x) &&
          (a * machine.buttonA.y + b * machine.buttonB.y == machine.prize.y)) {
          //debug(`${a},${b}`);
          cheapest = cost
        }
      }
    }

    if (cheapest < 401)
      total += cheapest;
  }

  return total;
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return lines.length
}
