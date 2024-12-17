import chalk from 'chalk'
import { enableDebug } from 'log'
import { formatDay, formatDayName, formatPerformance, validateDay, withPerformance } from 'utils/script'
import { parseArgs } from "util"
import { getDefaultFile, setDefaultFile } from 'io'

const runDay = async (day: number, isDevMode?: boolean, defaultInput?: string, part?: number, exec?: string) => {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun day 1')}`)
    return
  }

  if (isDevMode)
    enableDebug();

  if (defaultInput)
    setDefaultFile(defaultInput);

  const file = Bun.file(`./src/${formatDayName(day)}/index.ts`)
  const fileExists = await file.exists()

  if (!fileExists) {
    console.log(chalk.red(`Day ${formatDay(day)} does not exist!`))
    return
  }

  const imported = await import(`../${formatDayName(day)}/index.ts`)
  const { part1, part2 } = imported

  if (exec) {
    // If using exec we will run a custom export, rather than execute parts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn: any = imported[exec];

    if (!fn) {
      console.log(chalk.red(`Export ${exec} does not exist on ${day}!`))
      return
    }

    fn?.();
  }
  else {
    console.log(
      '💻',
      'Dev Mode:',
      chalk.cyanBright(isDevMode ? 'Yes' : 'No'),
      'Default File:',
      chalk.cyanBright(getDefaultFile()),
    )
    console.log();

    if (!part || part === 1) {
      const [one, onePerformance] = withPerformance(() => part1?.())
      console.log(
        '🌲',
        'Part One:',
        chalk.green(one ?? '—'),
        one ? `(${formatPerformance(onePerformance)})` : ''
      )
    }
    if (!part || part === 2) {
      const [two, twoPerformance] = withPerformance(() => part2?.())
      console.log(
        '🎄',
        'Part Two:',
        chalk.green(two ?? '—'),
        two ? `(${formatPerformance(twoPerformance)})` : ''
      )
    }
  }
}

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    dev: {
      type: 'boolean',
    },
    input: {
      type: 'string'
    },
    e: {
      type: 'boolean'
    },
    part: {
      type: 'string'
    },
    exec: {
      type: 'string'
    },
  },
  strict: true,
  allowPositionals: true,
});

const day = Number(positionals[2] ?? '');
const isDevMode = values['dev'];
const defaultInput = values['input'] ?? (values['e'] ? 'example' : undefined);
const part = Number(values['part'])
const exec = values['exec']

runDay(day, isDevMode, defaultInput, part, exec)
