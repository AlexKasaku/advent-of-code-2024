import { parseLines, readInput } from 'io'
import toSum from 'utils/toSum'

const input = await readInput('day-03')

type Instruction = {
  type: 'do' | 'dont'
} | {
  type: 'mul'
  val1: number
  val2: number
}

const parseInput = (): Instruction[] => {
  const text = parseLines(input).join()

  const matches = text.match(/(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g) ?? []

  return matches.map((x) => {
    if (x === 'do()') { return { type: 'do' } }
    if (x === 'don\'t()') { return { type: 'dont' } }

    const m = x.match(/(\d+),(\d+)/)!
    return { type: 'mul', val1: Number.parseInt(m[1]), val2: Number.parseInt(m[2]) }
  })
}

export const part1 = () => {
  const instructions = parseInput()

  return instructions.filter((i) => i.type === 'mul').map((x) => x.val1 * x.val2).reduce(toSum)
}

export const part2 = () => {
  const instructions = parseInput()

  let enabled = true
  let total = 0

  instructions.forEach((instruction) => {
    if (instruction.type === 'mul' && enabled) 
      total += instruction.val1 * instruction.val2
    else if (instruction.type === 'do') 
      enabled = true
    else if (instruction.type === 'dont') 
      enabled = false
  })

  return total
}
