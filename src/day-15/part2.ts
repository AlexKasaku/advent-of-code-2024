import { parseLines, readInput } from 'io'
import { log, debug, isDebug } from 'log'
import { PNG } from 'pngjs';
import { Position, Grid, CardinalDirection } from 'utils/grid';
import toSum from 'utils/toSum';
import { writeFileSync } from 'fs';

const input = await readInput('day-15')

type Space = Position & {
    isWall: boolean;
    isBoxL: boolean;
    isBoxR: boolean;
}
type Data = {
    grid: Grid<Space>,
    robot: Position,
    commands: CardinalDirection[]
}

const parseInput = (): Data => {
    const inputGroups = input.split('\n\n');

    const values = inputGroups[0]
        .replaceAll('#', '##')
        .replaceAll('O', '[]')
        .replaceAll('@', '@!')
        .replaceAll('.', '..')
        .replaceAll('!', '.')
        .split('\n').map((line) => line.split(''))

    const robot: Position = { x: 0, y: 0 }
    const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
        if (values[y][x] === '@') {
            robot.x = x
            robot.y = y
        }

        return {
            x,
            y,
            isWall: values[y][x] === '#',
            isBoxL: values[y][x] === '[',
            isBoxR: values[y][x] === ']'
        }
    });

    const commands: CardinalDirection[] = inputGroups[1].replaceAll('\n', '').split('').map(c => {
        switch (c) {
            case '<': return 'W';
            case '^': return 'N';
            case '>': return 'E';
            case 'v': return 'S';
        }
        throw 'Unsupported direction'
    })

    return {
        grid,
        robot,
        commands
    }
}

const getColorForSpace = ({ x, y, isWall, isBoxL, isBoxR }: Space, isRobot: boolean): number[] => {
    if (isWall) { return [255, 0, 0] }
    if (isRobot) { return [255, 255, 255] }
    if (isBoxL) { return [255, 243, 89] }
    if (isBoxR) { return [216, 207, 75] }
    return [0, 0, 0]
}

const renderGrid = (grid: Grid<Space>, robot: Position, elapsed: number): void => {

    let png = new PNG({ width: grid.Width * 4, height: grid.Height * 4 });

    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            let idx = (png.width * y + x) << 2;

            const space = grid.get({ x: Math.floor(x / 4), y: Math.floor(y / 4) })!;
            const colour = getColorForSpace(space, Math.floor(x / 4) === robot.x && Math.floor(y / 4) === robot.y);

            png.data[idx] = colour[0];
            png.data[idx + 1] = colour[1];
            png.data[idx + 2] = colour[2];
            png.data[idx + 3] = 255; // alpha (0 is transparent)
        }
    }

    const buff = PNG.sync.write(png);
    writeFileSync(`src/day-14/outputs/${String(elapsed).padStart(5, '0')}.png`, buff.buffer);
}

function moveRobot(grid: Grid<Space>, robot: Position, command: CardinalDirection) {

    // Movement has to work completely different to part 1. Every box could be half-aligned to another box and so on, so there's many
    // more space to consider.

    // We could find every box that is to be moved and check spaces after it, we're ok if we don't find a wall.
    // We'll check if we can move and build up a series of moves as we go, since the checks are largely the same, just if we hit a wall
    // we know we can immediately abandon
    let boxesToMove: { from: Position, to: Position }[] = [];
    let positionsToCheck: Position[] = [robot];
    let positionToString = ({ x, y }: Position) => `${x},${y}`;
    let spacesChecked: Set<string> = new Set<string>();

    while (positionsToCheck.length > 0) {
        const { x, y } = positionsToCheck.pop()!;

        // We might check a space more than once, if two boxes are vertically aligned for instance. If we know we've checked this space,
        // don't check it again.
        const posAsString = positionToString({ x, y });
        if (spacesChecked.has(posAsString))
            continue;
        spacesChecked.add(posAsString);

        let nextPosition;
        switch (command) {
            case 'N': nextPosition = { x, y: y - 1 }; break;
            case 'E': nextPosition = { x: x + 1, y }; break;
            case 'S': nextPosition = { x, y: y + 1 }; break;
            case 'W': nextPosition = { x: x - 1, y }; break;
        }

        //debug(`This space: ${posAsString}. Next space: ${positionToString(nextPosition)}`);;

        const thisSpace = grid.get({ x, y })!;
        const nextSpace = grid.get(nextPosition)!;

        if (nextSpace.isWall) {
            // We've hit a wall, immediately stop and do nothing! The whole move can't happen.
            debug('BLOCKED');
            return;
        }

        // Now check if we're running into a box, and if so add their spaces so we can go through the consequences
        // of hitting the spaces around them
        switch (command) {
            case 'N':
                if (thisSpace.isBoxL) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x, y: thisSpace.y }, to: { x: thisSpace.x, y: thisSpace.y - 1 } })
                } else if (thisSpace.isBoxR) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x - 1 && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x - 1, y: thisSpace.y }, to: { x: thisSpace.x - 1, y: thisSpace.y - 1 } })
                }

                if (nextSpace.isBoxL) {
                    // Push both sides to stack to check
                    positionsToCheck.push({ x: nextSpace.x, y: nextSpace.y });
                    positionsToCheck.push({ x: nextSpace.x + 1, y: nextSpace.y });
                } else if (nextSpace.isBoxR) {
                    // Push both sides to stack to check
                    positionsToCheck.push({ x: nextSpace.x - 1, y: nextSpace.y });
                    positionsToCheck.push({ x: nextSpace.x, y: nextSpace.y });
                }
                break;
            case 'S':
                if (thisSpace.isBoxL) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x, y: thisSpace.y }, to: { x: thisSpace.x, y: thisSpace.y + 1 } })
                } else if (thisSpace.isBoxR) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x - 1 && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x - 1, y: thisSpace.y }, to: { x: thisSpace.x - 1, y: thisSpace.y + 1 } })
                }

                if (nextSpace.isBoxL) {
                    // Push both sides to stack to check
                    positionsToCheck.push({ x: nextSpace.x, y: nextSpace.y });
                    positionsToCheck.push({ x: nextSpace.x + 1, y: nextSpace.y });
                } else if (nextSpace.isBoxR) {
                    // Push both sides to stack to check
                    positionsToCheck.push({ x: nextSpace.x - 1, y: nextSpace.y });
                    positionsToCheck.push({ x: nextSpace.x, y: nextSpace.y });
                }
                break;
            case 'W':
                if (thisSpace.isBoxL) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x, y: thisSpace.y }, to: { x: thisSpace.x - 1, y: thisSpace.y } })
                }
                if (nextSpace.isBoxR) {
                    // Only need to push space to left of left side to check
                    positionsToCheck.push({ x: nextSpace.x - 1, y: nextSpace.y });
                }
                // Can't hit isBoxL when moving W
                break;
            case 'E':
                if (thisSpace.isBoxR) {
                    if (!boxesToMove.some(move => move.from.x == thisSpace.x - 1 && move.from.y == thisSpace.y))
                        boxesToMove.push({ from: { x: thisSpace.x - 1, y: thisSpace.y }, to: { x: thisSpace.x, y: thisSpace.y } })
                }

                if (nextSpace.isBoxL) {
                    // Only need to push space to right of right side to check
                    positionsToCheck.push({ x: nextSpace.x + 1, y: nextSpace.y });
                }
                // Can't hit isBoxR when moving W
                break;
        }
    }

    // If we're here, that means this movement can go ahead as no wall was reached. But we may have boxes to move!
    //debug(boxesToMove);

    // Perform movements. Go through every box and clear them, then replace in new positions, rather than try to shift. 
    // Boxes are always referenced by their L hand side
    for (const { from } of boxesToMove) {
        grid.get(from)!.isBoxL = false;
        grid.get({ x: from.x + 1, y: from.y })!.isBoxR = false;
    }
    for (const { to } of boxesToMove) {
        grid.get(to)!.isBoxL = true;
        grid.get({ x: to.x + 1, y: to.y })!.isBoxR = true;
    }

    // Finally, move robot
    switch (command) {
        case 'N': robot.y--; break;
        case 'E': robot.x++; break;
        case 'S': robot.y++; break;
        case 'W': robot.x--; break;
    }
}

export const part2 = () => {
    const { grid, robot, commands } = parseInput()

    let i = 1;
    for (const command of commands) {
        log(`${i} / ${commands.length}`);
        moveRobot(grid, robot, command);
        renderGrid(grid, robot, i);
        i++;
    }

    return grid.Values.flat().filter(space => space.isBoxL).map(space => (space.y * 100) + space.x).reduce(toSum)
}