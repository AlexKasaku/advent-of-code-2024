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
type PlotSideData = { area: number; sides: number }

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


const updatePlotsPart2 = (values: Space[][], plots: Map<number, PlotSideData>, updateArea: boolean) => {

  // Maps a region id to lists of boundary positions
  const boundaries = new Map<number, Position[][]>();

  for (let y = 0; y < values.length; y++) {
    for (let x = 0; x < values[0].length + 1; x++) {
      // Compare cell with cell before it. We go one extra so we'll be compared the cell off the grid too.
      const thisSpace = values[y]?.[x];
      const prevSpace = values[y]?.[x - 1];

      if (thisSpace && !plots.has(thisSpace.regionId!))
        plots.set(thisSpace.regionId!, { area: 0, sides: 0 })

      // Update area
      if (thisSpace && updateArea)
        plots.get(thisSpace.regionId!)!.area++;

      // Update sides
      if (thisSpace?.char !== prevSpace?.char) {

        // Add this as a boundary of both regions, joining on to an existing boundary if it is adjacent.
        // We always process top-to-bottom, left-to-right so we only need for a boundary above.
        if (thisSpace) {
          const thisBoundaries = boundaries.get(thisSpace.regionId!) ?? [];

          // Look for a boundary include the position above, if it's there join that list, otherwise
          // start a new list.
          const existingBoundary = thisBoundaries.find(b => b.find(n => n.x == x && n.y == y - 1));
          if (existingBoundary) {
            if (!existingBoundary.find(n => n.x == x && n.y == y))
              existingBoundary.push({ x: x, y: y });
          }
          else
            thisBoundaries.push([{ x: x, y: y }]);

          boundaries.set(thisSpace.regionId!, thisBoundaries);
        }
        if (prevSpace) {
          const thisBoundaries = boundaries.get(prevSpace.regionId!) ?? [];

          // Look for a boundary include the position above, if it's there join that list, otherwise
          // start a new list.

          // Because we want to differentiate between adjacent boundaries that are on reverse sides, i.e.:
          // AB
          // BA

          // If we're adding to a previous boundary, we'll move the boundary line off grid so it won't ever be combined. This works
          // since we only need x + y as relative positions to each other for the sake of calculating the sides.
          const existingBoundary = thisBoundaries.find(b => b.find(n => n.x == x - values.length && n.y == y - 1 - values.length));
          if (existingBoundary) {
            if (!existingBoundary.find(n => n.x == x - values.length && n.y == y - values.length))
              existingBoundary.push({ x: x - values.length, y: y - values.length });
          }
          else
            thisBoundaries.push([{ x: x - values.length, y: y - values.length }]);

          boundaries.set(prevSpace.regionId!, thisBoundaries);
        }
      }
    }
  }

  //console.dir(boundaries, { depth: null });

  for (const [region, sides] of boundaries)
    plots.get(region)!.sides += sides.length
}



export const part1 = () => {
  const grid = parseInput()
  const plots = new Map<number, PlotData>();

  // Identify regions
  identifyRegions(grid);

  // Go through every column and row and compare plots
  updatePlots(grid.Values, plots, true);
  updatePlots(transpose(grid.Values), (plots), false);

  return plots.values().map(x => x.area * x.perimeter).reduce(toSum)
}

export const part2 = () => {
  const grid = parseInput()
  const plots = new Map<number, PlotSideData>();

  // Identify regions
  identifyRegions(grid);

  // Go through every column and row and compare plots
  updatePlotsPart2(grid.Values, plots, true);
  updatePlotsPart2(transpose(grid.Values), plots, false);

  // Tried 814074 
  return plots.values().map(x => x.area * x.sides).reduce(toSum)
}


