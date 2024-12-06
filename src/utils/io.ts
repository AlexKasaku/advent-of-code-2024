import chalk from 'chalk';
import { EOL } from 'os';
import type { Day } from 'types'

type Transform<Res, Input = string> = (s: Input) => Res

let defaultFile = 'input';

export const getDefaultFile = () => defaultFile;
export const setDefaultFile = (fileName: string ) => defaultFile = fileName;

export const readFile = async (filepath: string) => {
  const file = Bun.file(filepath)

  if (!(await file.exists())) {
    console.log(chalk.red(`File ${filepath} does not exist!`))
    throw 'FileNotFound';
  }

  const text = await file.text()
  return text.trim()
}

export const readInput = async (dir: Day, fileName?: string) => {
  const filepath = `./src/${dir}/inputs/${fileName ?? defaultFile}.txt`
  return (await readFile(filepath)).replaceAll(/\r?\n/g, '\n');
}

export const parseLines = <T = string>(
  input: string,
  as?: Transform<T>,
  { includeEmpty }: { includeEmpty?: boolean } = {}
) => {
  let lines = input.split('\n')
  if (!includeEmpty) {
    lines = lines.filter(Boolean)
  }
  return as ? lines.map(as) : lines as T[]
}

export const parseGroups = <T = string>(
  input: string,
  as?: Transform<T>
) => {
  const groups = input.split('\n\n')

  return groups.map((group) => {
    return parseLines(group, as)
  }) as T[][]
}
