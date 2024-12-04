import { Direction, Grid } from './grid';

describe('grid', () => {
  describe('getNeighbours', () => {
    const grid = new Grid(3, 3, ({ x, y }) => y * 3 + x + 1);

    it.each([
      [{ x: 0, y: 0 }, [2, 4, 5]],
      [{ x: 1, y: 0 }, [1, 3, 4, 5, 6]],
      [{ x: 2, y: 0 }, [2, 5, 6]],
      [{ x: 0, y: 1 }, [1, 2, 5, 7, 8]],
      [{ x: 1, y: 1 }, [1, 2, 3, 4, 6, 7, 8, 9]],
      [{ x: 2, y: 1 }, [2, 3, 5, 8, 9]],
      [{ x: 0, y: 2 }, [4, 5, 8]],
      [{ x: 1, y: 2 }, [4, 5, 6, 7, 9]],
      [{ x: 2, y: 2 }, [5, 6, 8]],
    ])(
      'returns correct neighbours for non-orthagonal',
      (position, expected) => {
        expect(grid.getNeighbours(position, false).sort()).toEqual(expected);
      },
    );

    it.each([
      [{ x: 0, y: 0 }, [2, 4]],
      [{ x: 1, y: 0 }, [1, 3, 5]],
      [{ x: 2, y: 0 }, [2, 6]],
      [{ x: 0, y: 1 }, [1, 5, 7]],
      [{ x: 1, y: 1 }, [2, 4, 6, 8]],
      [{ x: 2, y: 1 }, [3, 5, 9]],
      [{ x: 0, y: 2 }, [4, 8]],
      [{ x: 1, y: 2 }, [5, 7, 9]],
      [{ x: 2, y: 2 }, [6, 8]],
    ])('returns correct neighbours for orthagonal', (position, expected) => {
      expect(grid.getNeighbours(position).sort()).toEqual(expected);
      expect(grid.getNeighbours(position, true).sort()).toEqual(expected);
    });
  });

  describe('getAllInDirection', () => {
    // Create 1 - 25 in grid of 5x5; 13 in the center;
    // 1  2  3  4  5
    // 6  7  8  9  10
    // 11 12 13 14 15
    // 16 17 18 19 20
    // 21 22 23 24 25
    const grid = new Grid(5, 5, ({ x, y }) => y * 5 + x + 1);

    it.each([
      ['N', [8, 3]],
      ['NE', [9, 5]],
      ['E', [14, 15]],
      ['SE', [19, 25]],
      ['S', [18, 23]],
      ['SW', [17, 21]],
      ['W', [12, 11]],
      ['NW', [7, 1]],
    ])('returns correct positions for %p at center', (direction, expected) => {
      const center = { x: 2, y: 2 }; // 13

      expect(grid.getAllInDirection(center, direction as Direction)).toEqual(
        expected,
      );
    });

    it.each([
      ['N', [14, 9, 4]],
      ['NE', [15]],
      ['E', [20]],
      ['SE', [25]],
      ['S', [24]],
      ['SW', [23]],
      ['W', [18, 17, 16]],
      ['NW', [13, 7, 1]],
    ])(
      'returns correct positions for %p at off-center position',
      (direction, expected) => {
        const center = { x: 3, y: 3 }; // 19

        expect(grid.getAllInDirection(center, direction as Direction)).toEqual(
          expected,
        );
      },
    );

    it.each([
      ['N', []],
      ['NE', []],
      ['W', []],
      ['NW', []],
    ])(
      'returns correct positions for %p at edge position',
      (direction, expected) => {
        const center = { x: 0, y: 0 }; // 1

        expect(grid.getAllInDirection(center, direction as Direction)).toEqual(
          expected,
        );
      },
    );
  });

  describe('getSegment', () => {
    const grid = new Grid(3, 3, ({ x, y }) => y * 3 + x + 1);

    it('returns correct segment of grid when completely on grid', () => {
      expect(grid.getSegment({ x: 0, y: 0 }, 2, 2)).toEqual([
        [1, 2],
        [4, 5],
      ]);
    });

    it.each([
      [{ x: 2, y: 0 }, 2, 2, [[3], [6]]],
      [{ x: 2, y: 2 }, 2, 2, [[9]]],
      [{ x: 2, y: 4 }, 2, 2, []],
    ])(
      'returns correct partial segment of grid when partially off grid',
      (position, width, height, expected) => {
        expect(grid.getSegment(position, width, height)).toEqual(expected);
      },
    );
  });

  describe('forEachInSegment', () => {
    const grid = new Grid(3, 3, () => 1);

    it('updates segments correctly in grid', () => {
      grid.updateEachInSegment({ x: 0, y: 0 }, 2, 2, (x) => x + 1);

      expect(grid.Values).toEqual([
        [2, 2, 1],
        [2, 2, 1],
        [1, 1, 1],
      ]);
    });
  });
});
