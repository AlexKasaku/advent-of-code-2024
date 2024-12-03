import { parseLines, readInput } from 'io'
import { debug, log } from 'log'
import toSum from 'utils/toSum'

const input = await readInput('day-03')

const parseInput = () => {
  const text = parseLines(input).join()
  const matches = text.match(/mul\(\d{1,3},\d{1,3}\)/g) ?? []

  return matches.map((x) => {
    const m = x.match(/(\d+),(\d+)/)!
    return { x: Number.parseInt(m[1]), y: Number.parseInt(m[2]) }
  })
}

export const part1 = () => {
  const instructions = parseInput()
  debug(instructions)

  return instructions.map((x) => x.x * x.y).reduce(toSum)
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return lines.length
}
