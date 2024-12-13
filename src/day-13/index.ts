import { parseGroups, parseLines, readInput } from 'io'
import { log, debug } from 'log'

const input = await readInput('day-13')

type Machine = {
  buttonA: { x: number, y: number },
  buttonB: { x: number, y: number }
  prize: { x: number, y: number }
}

const parseInput = (prizeUplift: number): Machine[] => {
  return input.split('\n\n').map(group => {

    const regex = /Button A: X\+(\d+), Y\+(\d+)\s+Button B: X\+(\d+), Y\+(\d+)\s+Prize: X=(\d+), Y=(\d+)/;
    const matches = group.match(regex)!.slice(1, 7).map(Number);

    return {
      buttonA: { x: matches[0], y: matches[1] },
      buttonB: { x: matches[2], y: matches[3] },
      prize: { x: matches[4] + prizeUplift, y: matches[5] + prizeUplift },
    }

  })
}

export const part1 = () => {
  const machines = parseInput(0)

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
  const machines = parseInput(10000000000000)

  let total = 0;

  for (const machine of machines) {

    // Test a solve 
    const b = ((machine.buttonA.x * machine.prize.y) - (machine.buttonA.y * machine.prize.x)) / ((machine.buttonA.x * machine.buttonB.y) - (machine.buttonA.y * machine.buttonB.x));

    if (Number.isInteger(b)) {
      // Solvable
      const a = (machine.prize.x - (machine.buttonB.x * b)) / machine.buttonA.x;

      if (Number.isInteger(a)) {
        debug(`${a} + ${b}`);

        total += 3 * a + b;
      }
    }

  }

  return total
}
