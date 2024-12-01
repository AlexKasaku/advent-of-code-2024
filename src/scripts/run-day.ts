import chalk from 'chalk'
import { enableDebug } from 'log'
import { formatDay, formatDayName, formatPerformance, validateDay, withPerformance } from 'utils/script'
import { parseArgs } from "util"
import { getDefaultFile, setDefaultFile } from 'io'

const runDay = async (day: number, isDevMode?: boolean, defaultInput?: string) => {
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

  const { part1, part2 } = await import(`../${formatDayName(day)}/index.ts`)

  const [one, onePerformance] = withPerformance(() => part1?.())
  const [two, twoPerformance] = withPerformance(() => part2?.())

  if (!isDevMode) 
    console.clear()

  console.log(
    '💻',
    'Dev Mode:',
    chalk.cyanBright(isDevMode ? 'Yes' : 'No'),
    'Default File:',
    chalk.cyanBright(getDefaultFile()),
  )    
  console.log();

  console.log(
    '🌲',
    'Part One:',
    chalk.green(one ?? '—'),
    one ? `(${formatPerformance(onePerformance)})` : ''
  )
  console.log(
    '🎄',
    'Part Two:',
    chalk.green(two ?? '—'),
    two ? `(${formatPerformance(twoPerformance)})` : ''
  )
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
    }
  },
  strict: true,
  allowPositionals: true,
});

const day = Number(positionals[2] ?? '');
const isDevMode = values['dev'];
const defaultInput = values['input'] ?? (values['e'] ? 'example' : undefined);

runDay(day, isDevMode, defaultInput)
