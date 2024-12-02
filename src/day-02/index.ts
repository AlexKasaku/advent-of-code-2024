import { parseLines, readInput } from 'io'
import { debug, log } from 'log'

const input = await readInput('day-02')

const parseInput = (): number[][] => {
  return parseLines(input).map((x) => x.split(' ').map(Number))
}

export const part1 = () => {
  const numbers = parseInput()

  let safeLines = 0

  numbers.forEach((report) => {
    let safe = true

    const increasing = (report[0] - report[1]) < 0

    for (let x = 1; x < report.length; x++) {
      const delta = report[x] - report[x - 1]
      const diff = Math.abs(delta)

      if (diff < 1 || diff > 3) { safe = false }
      if (increasing && delta < 0 || !increasing && delta > 0) { safe = false }
      if (!safe) { break }
    }

    if (safe) { safeLines++ }
  })

  return safeLines
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return lines.length
}
