import chalk from 'chalk'
import { parseLines, readInput } from 'io'
import { log, debug } from 'log'

const input = await readInput('day-17')

type Registers = { a: number, b: number, c: number }
type Program = number[]
type Data = { registers: Registers, program: Program }
type State = { registers: Registers, pointer: number, output: number[] }

const parseInput = (): Data => {
  const inputGroups = input.split('\n\n');
  const registerValues = [...inputGroups[0].matchAll(/(\d+)/g)].map(v => Number(v[0]));

  return {
    registers: {
      a: registerValues[0],
      b: registerValues[1],
      c: registerValues[2],
    },
    program: inputGroups[1].substring(9).split(',').map(Number)
  }
}

const getComboOperand = (operand: number, { a, b, c }: Registers): number => {
  switch (operand) {
    case 0: return 0;
    case 1: return 1;
    case 2: return 2;
    case 3: return 3;
    case 4: return a;
    case 5: return b;
    case 6: return c;
  }
  throw 'Invalid operand';
}
const executeOperation = (opcode: number, operand: number, state: State) => {

  const { registers, output } = state;
  let jumped = false;
  switch (opcode) {

    case 0:
      // ADV
      registers.a = Math.trunc(registers.a / Math.pow(2, getComboOperand(operand, registers)))
      break;
    case 1:
      // BXL
      registers.b = registers.b ^ operand;
      break;
    case 2:
      // BST
      registers.b = getComboOperand(operand, registers) % 8;
      break;
    case 3:
      // JNZ
      if (registers.a != 0) {
        state.pointer = operand;
        jumped = true;
      }
      break;
    case 4:
      // BXC
      registers.b = registers.b ^ registers.c;
      break;
    case 5:
      // OUT
      output.push(getComboOperand(operand, registers) % 8);
      break;
    case 6:
      // BDV
      registers.b = Math.trunc(registers.a / Math.pow(2, getComboOperand(operand, registers)))
      break;
    case 7:
      // CDV
      registers.c = Math.trunc(registers.a / Math.pow(2, getComboOperand(operand, registers)))
      break;

  }

  if (!jumped)
    state.pointer += 2;
}

const debugState = (state: State, program: number[]): void => {
  debug(
    `Pointer: ${chalk.yellow(state.pointer)}`,
    `Opcode: ${chalk.green(program[state.pointer])}`,
    `Operand: ${chalk.green(program[state.pointer + 1])}`,
    `A: ${chalk.blueBright(state.registers.a)}`,
    `B: ${chalk.blueBright(state.registers.b)}`,
    `C: ${chalk.blueBright(state.registers.c)}`);
}

export const part1 = () => {
  const { registers, program } = parseInput()

  const state: State = {
    registers,
    pointer: 0,
    output: []
  }

  debug(registers);
  debug(program);

  while (state.pointer < program.length) {
    debugState(state, program);
    executeOperation(program[state.pointer], program[state.pointer + 1], state);
    debug(state.output);
  }

  debugState(state, program);

  return state.output.map(x => x.toString()).join(',');
}

export const part2 = () => {
  const data = parseInput()
  return 0;
}


