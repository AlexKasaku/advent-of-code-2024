import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { Position, Grid } from 'utils/grid'
import toSum from 'utils/toSum'
import transpose from 'utils/transpose'

const input = await readInput('day-12')

type Space = Position & {
  char: string;
  regionId?: number;
}
type PlotData = { area: number; perimeter: number }

const parseInput = (): Grid<Space> => {
  const lines = parseLines(input)
  const values = lines.map((line) => line.split(''))

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    char: values[y][x]
  }
  ));
}

const updatePlots = (values: Space[][], plots: Map<number, PlotData>, updateArea: boolean) => {
  for (let rowIndex = 0; rowIndex < values.length + 1; rowIndex++) {
    for (let colIndex = 0; colIndex < values[0].length + 1; colIndex++) {
      // Compare cell with cell before it. We go one extra so we'll be compared the cell off the grid too.
      const thisSpace = values[rowIndex]?.[colIndex];
      const prevSpace = values[rowIndex]?.[colIndex - 1];

      if (thisSpace && !plots.has(thisSpace.regionId!))
        plots.set(thisSpace.regionId!, { area: 0, perimeter: 0 })

      // Update area
      if (thisSpace && updateArea)
        plots.get(thisSpace.regionId!)!.area++;

      // Update perimeter
      if (thisSpace?.char !== prevSpace?.char) {
        if (thisSpace)
          plots.get(thisSpace.regionId!)!.perimeter++
        if (prevSpace) {
          plots.get(prevSpace.regionId!)!.perimeter++;
        }
      }

    }
  }
}

// const identifyRegions = (grid: Grid<Space>): void => {

//   // Identify regions in the grid and assign a unique id. A region is defined by spaces
//   // that touch each other with the same char.
//   let regionCounter = 1;
//   const merges = new Map<number, number[]>();
//   for (let y = 0; y < grid.Values.length; y++) {
//     for (let x = 0; x < grid.Values[0].length; x++) {

//       const thisSpace = grid.get({ x, y })!;
//       const neighbours = grid.getNeighbours({ x, y }, true);

//       neighbours.forEach(neighbour => {
//         if (neighbour.regionId && !thisSpace.regionId && neighbour.char == thisSpace.char) {
//           // Neighbour that is matching and already assigned a region, we'll take it.
//           thisSpace.regionId = neighbour.regionId;
//         } else if (!neighbour.regionId && thisSpace.regionId && neighbour.char == thisSpace.char) {
//           // Neighbour that is matching and already assigned a region, we'll take it.
//           neighbour.regionId = thisSpace.regionId;
//         } else if (neighbour.regionId && thisSpace.regionId && neighbour.char == thisSpace.char && neighbour.regionId !== thisSpace.regionId) {

//           // Two adjacent regions that should be merged
//           if (!merges.has(thisSpace.regionId) && !merges.has(neighbour.regionId))
//             merges.set(thisSpace.regionId, [neighbour.regionId]);
//           else if (merges.has(thisSpace.regionId) && !merges.has(neighbour.regionId))
//             merges.set(thisSpace.regionId, [...merges.get(thisSpace.regionId)!.filter(x => x !== neighbour.regionId), neighbour.regionId]);
//           else
//             merges.set(neighbour.regionId, [...merges.get(neighbour.regionId)!.filter(x => x !== thisSpace.regionId), thisSpace.regionId]);
//         }
//       });

//       if (!thisSpace.regionId) {
//         thisSpace.regionId = regionCounter;
//         regionCounter++
//       }
//     }
//   }

//   debug(merges);
//   // Perform merges. Flip map to create updates
//   const mergeMap = new Map<number, number>();
//   merges.entries().forEach(([to, froms]) => {
//     froms.forEach(f => {
//       if (mergeMap.has(f)) throw 'Duplicate merge state found on ' + f;
//       mergeMap.set(f, to);
//     })
//   });

//   grid.Values.flat().forEach(space => {
//     while (mergeMap.has(space.regionId!)) {
//       space.regionId = mergeMap.get(space.regionId!)
//     }
//   });
// }

const identifyRegions = (grid: Grid<Space>): void => {

  // Walk across the grid, each time we find a space without a region ID we will spider out from
  // that point and assign a new region ID to all plots in that area with the same char.
  let regionCounter = 1;
  for (let y = 0; y < grid.Values.length; y++) {
    for (let x = 0; x < grid.Values[0].length; x++) {
      if (!grid.get({ x, y })?.regionId) {
        const thisSpace = grid.get({ x, y })!;

        // On a space with no region id. Assign a new regionID and find all spaces in this region;
        thisSpace.regionId = regionCounter++;

        //const adjacents: Space[] = [];
        const spacesToCheck: Space[] = [thisSpace];

        while (spacesToCheck.length > 0) {
          const space = spacesToCheck.pop()!;
          grid.getNeighbours(space, true).forEach(neighbour => {
            if (neighbour.char === space.char && !neighbour.regionId) {
              neighbour.regionId = thisSpace.regionId;
              spacesToCheck.push(neighbour);
            }
          })
        }
      }
    }
  }

}

export const part1 = () => {
  const grid = parseInput()
  const plots = new Map<number, PlotData>();

  // Identify regions
  identifyRegions(grid);

  debug(grid.Values)

  // Go through every column and row and compare plots
  updatePlots(grid.Values, plots, true);
  updatePlots(transpose(grid.Values), (plots), false);

  debug(plots);

  return plots.values().map(x => x.area * x.perimeter).reduce(toSum)
}

export const part2 = () => {
  const grid = parseInput()
  return 0;
}


