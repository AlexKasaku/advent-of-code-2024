import { parseLines, readInput } from 'io'

const input = await readInput('day-02')

const parseInput = (): number[][] => {
  return parseLines(input).map((x) => x.split(' ').map(Number))
}

const findUnsafeIndex = (report: number[]) => {
  const increasing = (report[0] - report[1]) < 0

  for (let x = 1; x < report.length; x++) {
    const delta = report[x] - report[x - 1]
    const diff = Math.abs(delta)

    if (diff < 1 || diff > 3) { return x - 1 }
    if (increasing && delta < 0 || !increasing && delta > 0) { return x - 1 }
  }

  return -1
}

export const part1 = () => {
  const numbers = parseInput()

  return numbers.filter((report) => findUnsafeIndex(report) === -1).length
}

export const part2 = () => {
  const numbers = parseInput()

  const safeLines = numbers.filter((report) => {
    let unsafeIndex = findUnsafeIndex(report)
    if (unsafeIndex === -1) { return true }

    for (let index = 0; index < report.length; index++) {
      const updatedReport = [...report]
      updatedReport.splice(index, 1)

      unsafeIndex = findUnsafeIndex(updatedReport)
      if (unsafeIndex === -1) { return true }
    }

    return false
  }).length

  return safeLines
}
