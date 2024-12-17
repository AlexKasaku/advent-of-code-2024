import { parseLines, readInput } from 'io'
import { log, debug, isDebug } from 'log'
import { Position, Grid, CardinalDirection } from 'utils/grid';
import blessed from 'blessed';
import { parseInput, moveRobot, Space } from './part2'

const getSpaceChar = ({ isBoxL, isBoxR, isWall }: Space, isRobot: boolean) => {
    if (isRobot) return 'R';
    if (isBoxL) { return '[' }
    if (isBoxR) { return ']' }
    if (isWall) { return '#' }
    return ' '
}

export const gui = () => {
    const { grid, robot } = parseInput()

    // Create a screen object.
    let screen = blessed.screen({
        smartCSR: true
    });

    // Create a box perfectly centered horizontally and vertically.
    let box = blessed.box({
        top: 'center',
        left: 'center',
        width: grid.Width + 2,
        height: grid.Height + 2,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            }
        },
    });

    box.key('q', () => { moveRobot(grid, robot, 'N'); render(); });
    box.key('a', () => { moveRobot(grid, robot, 'S'); render(); });
    box.key('o', () => { moveRobot(grid, robot, 'W'); render(); });
    box.key('p', () => { moveRobot(grid, robot, 'E'); render(); });

    screen.append(box);
    screen.cursor = {
        color: "black",
        blink: false,
        artificial: true,
        shape: 'block'
    };

    screen.key(['escape', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    const render = () => {

        let content = '';
        for (let y = 0; y < grid.Height; y++) {
            for (let x = 0; x < grid.Width; x++) {
                content += getSpaceChar(grid.get({ x, y })!, robot.x === x && robot.y === y);
            }
            content += '\n';
        }

        box.setContent(content);
        screen.render();

    }

    render();

}