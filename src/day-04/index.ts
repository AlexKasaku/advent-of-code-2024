import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { allDirections, Direction, Grid } from 'utils/grid';

const input = await readInput('day-04')

export type Space = {
  char: string;
};

const parseInput = () => {
  const lines = parseLines(input);

  debug(lines.length)
  
  const values = lines.map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    char: values[y][x],
  }));
}

const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    debug(row.reduce((a, b) => a + b.char, ''));
  debug();
};

export const part1 = () => {
  const grid = parseInput()
  
  let wordsFound = 0;

  for (let curY = 0; curY < grid.Height; curY++) {
    for (let curX = 0; curX < grid.Width; curX++) {
      
      allDirections.forEach(direction => 
      {
        const word = grid.Values[curY][curX]!.char + grid.getAllInDirection({x: curX, y: curY}, direction, 3).map(space => space!.char).join('');
        
        if (word === 'XMAS')
        {
          //debug(`XMAS found at X: ${curX} Y: ${curY} Direction: ${direction}`);
          wordsFound++;
        }
      });
    }
  }

  return wordsFound
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return 0
}
