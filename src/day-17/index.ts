import chalk from 'chalk'
import { readInput } from 'io'
import { debug } from 'log'
import { asc } from 'utils'

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
      registers.b = (registers.b ^ operand) >>> 0;
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
      registers.b = (registers.b ^ registers.c) >>> 0;
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

export const getOutputForRegisterA = (a: number, program: number[]): number[] => {
  const state: State = {
    registers: { a, b: 0, c: 0 },
    pointer: 0,
    output: []
  }

  while (state.pointer < program.length) {
    executeOperation(program[state.pointer], program[state.pointer + 1], state);
  }

  return state.output;
}

// This is the equivalent of the program but simplified down without the need to pass in the program. 
// It will generate the same answer.
export const getOutputFromQuickProgram = (aIn: number): number[] => {

  let a = aIn, b = 0, c = 0;
  const output: number[] = [];

  while (a > 0) {
    b = (a % 8) ^ 3;
    b = ((b ^ Math.trunc(a / Math.pow(2, b))) ^ 5) >>> 0;
    a = Math.trunc(a / 8)
    //debug(`A: ${a} B: ${b} Output: ${b % 8}`);
    output.push(b % 8);
  }

  return output;
}

export const part2 = () => {

  const digits = [0, 1, 2, 3, 4, 5, 6, 7].map(x => x.toString())
  const prefixes = [""];
  const answers = [];

  const target = [2, 4, 1, 3, 7, 5, 4, 2, 0, 3, 1, 5, 5, 5, 3, 0];

  while (prefixes.length > 0) {
    const prefix = prefixes.pop()!;

    for (const digit of digits) {
      const testNumberOct = (prefix + digit).padEnd(16, "0");
      const testNumberInt = parseInt(testNumberOct, 8);

      const output = getOutputFromQuickProgram(testNumberInt);

      // Depending on the size of the prefix we want to test the digit at the right location (all the other ones
      // after it should match based on previous prefixes)
      const position = 15 - prefix.length;
      if (output[position] == target[position]) {
        if (position == 0) {
          debug(testNumberOct);
          debug(testNumberInt);
          answers.push(testNumberInt);
        }
        else {
          prefixes.push(prefix + digit);
        }
      }
    }
  }

  return answers.sort(asc)[0];
}


