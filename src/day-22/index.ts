import chalk from 'chalk';
import { parseLines, readInput } from 'io'
import { log, debug, isDebug } from 'log'

const input = await readInput('day-22')

const parseInput = (): number[] => {
  return parseLines(input).map(Number);
}

const asBin = (value: number) => value.toString(2).padStart(32, "0");

const debugMsg = (msg: string, rest: string) => {
  if (isDebug()) {
    debug(
      msg.padEnd(10, ' '),
      ' : ',
      rest
    )
  }
};

const mixAndPrune = (value1: number, value2: number) => {
  //debugMsg('XOR Val1', chalk.blueBright(asBin(value1)));
  //debugMsg('XOR Val2', chalk.blueBright(asBin(value2)));
  //debugMsg('XOR Rslt', chalk.blueBright(asBin(value1 ^ value2)));
  //debugMsg('MOD Value', chalk.redBright(asBin(16777215)));
  return (value1 ^ value2) & 16777215;  // 2^24 - 1, e.g. 11111111111111111111111
}

const getNextValue = (value: number) => {
  let result = value;
  //debugMsg('<< 6', chalk.yellowBright(asBin(result << 6)));
  result = mixAndPrune(result << 6, result); // Shift left 6 = * 64
  //debugMsg('Result', asBin(result));
  //debugMsg('>> 5', chalk.yellowBright(asBin(result >> 5)));
  result = mixAndPrune(result >> 5, result); // Shift right 5 = / 32 and trunc
  //debugMsg('Result', asBin(result));
  //debugMsg('<< 11', chalk.yellowBright(asBin(result << 11)));
  result = mixAndPrune(result << 11, result); // Shift left 11 = * 2024
  //debugMsg('Result', asBin(result));
  return result;
}

export const part1 = () => {
  const values = parseInput()

  let total = 0;
  let iterations = 2000;

  for (const value of values) {
    let x = value;
    //debugMsg('X', chalk.greenBright(x));
    //debugMsg('X Bin', chalk.cyanBright(asBin(x)));

    for (let i = 0; i < iterations; i++) {
      x = getNextValue(x);
      //debugMsg('X', chalk.greenBright(x));

    }

    total += x;
  }
  return total;
}

export const part2 = () => {
  const values = parseInput()
  return 0
}
