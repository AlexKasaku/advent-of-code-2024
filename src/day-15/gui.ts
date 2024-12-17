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
        smartCSR: true,
    });

    // Create a box perfectly centered horizontally and vertically.
    let gridBox = blessed.box({
        top: 'center',
        left: 10,
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

    let commandBox = blessed.box({
        top: 'center',
        left: grid.Width + 14,
        width: 3,
        hieght: 10,
        alwaysScroll: true,
        scrollable: true,
        border: {
            type: 'line'
        },
        style: {
            bg: 'blue',
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            }
        },
    })

    gridBox.key('q', () => { moveRobot(grid, robot, 'N'); render('N'); });
    gridBox.key('a', () => { moveRobot(grid, robot, 'S'); render('S'); });
    gridBox.key('o', () => { moveRobot(grid, robot, 'W'); render('W'); });
    gridBox.key('p', () => { moveRobot(grid, robot, 'E'); render('E'); });

    screen.append(gridBox);
    screen.append(commandBox);

    screen.cursor = {
        color: "black",
        blink: false,
        artificial: true,
        shape: 'block'
    };

    screen.key(['escape', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    const render = (command?: string) => {

        if (command) {
            commandBox.pushLine(command)
            commandBox.scroll(1)
        }
        let content = '';
        for (let y = 0; y < grid.Height; y++) {
            for (let x = 0; x < grid.Width; x++) {
                content += getSpaceChar(grid.get({ x, y })!, robot.x === x && robot.y === y);
            }
            content += '\n';
        }

        gridBox.setContent(content);
        screen.render();
    }

    render();
    screen.render();

}