import { parseLines, readInput } from 'io'
import { debug, log } from 'log'
import { desc } from 'utils'
import toSum from 'utils/toSum'

const input = await readInput('day-07')

type Equation = { result: number; values: number[] }

const parseInput = (): Equation[] => {
  return parseLines(input).map((line) => {
    const [resultString, valueString] = line.split(':')

    return {
      result: Number.parseInt(resultString),
      values: valueString.trim().split(' ').map(Number)
    }
  })
}

const isValidResult = ({ result, values }: Equation, withConcatenation: boolean): boolean => {
  // Determine if result can be met with + and * operators
  type State = { total: number; values: number[] }
  const [firstValue, ...lastValues] = values
  const states: State[] = [{ total: firstValue, values: lastValues }]

  while (states.length > 0) {
    const { total: currentTotal, values: [nextValue, ...remainingValues] } = states.pop()!

    // Test and push +
    const valueForPlus = currentTotal + nextValue
    if (valueForPlus === result && remainingValues.length === 0) { return true }
    if (valueForPlus <= result && remainingValues.length > 0) { states.push({ total: valueForPlus, values: remainingValues }) };

    // Test and push *
    const valueForMultiply = currentTotal * nextValue
    if (valueForMultiply === result && remainingValues.length === 0) { return true }
    if (valueForMultiply <= result && remainingValues.length > 0) { states.push({ total: valueForMultiply, values: remainingValues }) };

    if (withConcatenation) {
      const valueForConcat = Number.parseInt(currentTotal + nextValue.toString())
      if (valueForConcat === result && remainingValues.length === 0) { return true }
      if (valueForConcat <= result && remainingValues.length > 0) { states.push({ total: valueForConcat, values: remainingValues }) };
    }
  }

  // Exhausted attempts, it can't be done
  return false
}

export const part1 = () => {
  const equations = parseInput()

  return equations.filter((x) => isValidResult(x, false)).map((x) => x.result).reduce(toSum, 0)
}

export const part2 = () => {
  const equations = parseInput()

  return equations.filter((x) => isValidResult(x, true)).map((x) => x.result).reduce(toSum, 0)
}
