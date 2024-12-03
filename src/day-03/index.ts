import { parseLines, readInput } from 'io'
import { debug, log } from 'log'
import toSum from 'utils/toSum'

const input = await readInput('day-03')

type InstructionType = 'mul' | 'do' | 'dont'
type Instruction = {
  type: InstructionType
  val1?: number
  val2?: number
}

const parseInput = (mulOnly: boolean): Instruction[] => {
  const text = parseLines(input).join()

  const matches = (mulOnly
    ? text.match(/mul\(\d{1,3},\d{1,3}\)/g)
    : text.match(/(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g)
  ) ?? []

  return matches.map((x) => {
    if (x === 'do()') { return { type: 'do' } }
    if (x === 'don\'t()') { return { type: 'dont' } }

    const m = x.match(/(\d+),(\d+)/)!
    return { type: 'mul', val1: Number.parseInt(m[1]), val2: Number.parseInt(m[2]) }
  })
}

export const part1 = () => {
  const instructions = parseInput(true)

  return instructions.map((x) => x.val1! * x.val2!).reduce(toSum)
}

export const part2 = () => {
  const instructions = parseInput(false)

  let enabled = true
  let total = 0

  instructions.forEach((instruction) => {
    if (instruction.type === 'mul' && enabled) { total += instruction.val1! * instruction.val2! } else if (instruction.type === 'do') { enabled = true } else if (instruction.type === 'dont') { enabled = false }
  })

  return total
}
