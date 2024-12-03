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

  const regex = /(?<type>(mul|do|don't))\(((?<val1>\d{1,3}),(?<val2>\d{1,3}))?\)/g
  const matches = [...text.matchAll(regex)]

  return matches.map((x) => {
    if (x.groups!['type'] == 'do') { return { type: 'do' } }
    if (x.groups!['type'] == 'don\'t') { return { type: 'dont' } }

    return { type: 'mul', val1: Number.parseInt(x.groups!['val1']), val2: Number.parseInt(x.groups!['val2']) }
  })
}

export const part1 = () => parseInput().filter((i) => i.type === 'mul').map((x) => x.val1 * x.val2).reduce(toSum)

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
