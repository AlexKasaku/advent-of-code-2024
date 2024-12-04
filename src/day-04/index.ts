import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { allDirections, Direction, Grid } from 'utils/grid';

const input = await readInput('day-04')

export type Space = {
  char: string;
};

const parseInput = () => {
  const values = parseLines(input).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    char: values[y][x],
  }));
}

export const part1 = () => {
  const grid = parseInput()
  
  let wordsFound = 0;

  for (let curY = 0; curY < grid.Height; curY++) {
    for (let curX = 0; curX < grid.Width; curX++) {
      
      allDirections.forEach(direction => 
      {
        const word = grid.Values[curY][curX]!.char + grid.getAllInDirection({x: curX, y: curY}, direction, 3).map(space => space!.char).join('');
        
        if (word === 'XMAS')
          wordsFound++;
      });
    }
  }

  return wordsFound
}

export const part2 = () => {
  const grid = parseInput()
  
  let wordsFound = 0;

  const getWord = (x: number, y:number, direction: Direction) => 
    y < grid.Height && x < grid.Width 
      ? grid.Values[y][x]!.char + grid.getAllInDirection({x, y}, direction, 2).map(space => space!.char).join('') 
      : '';

  const isMatch = (word1: string, word2: string) => word1 === 'MAS' && word1 === word2;

  for (let curY = 0; curY < grid.Height; curY++) {
    for (let curX = 0; curX < grid.Width; curX++) {
        
        if (isMatch(getWord(curX,curY,'SE'), getWord(curX, curY+2,'NE')))
          wordsFound++;

        if (isMatch(getWord(curX,curY,'SE'), getWord(curX+2, curY,'SW')))
          wordsFound++;
        
        if (isMatch(getWord(curX,curY,'SW'), getWord(curX, curY+2,'NW')))
          wordsFound++;
          
        if (isMatch(getWord(curX,curY,'NE'), getWord(curX+2, curY,'NW')))
          wordsFound++;          
    }
  }

  return wordsFound
}
