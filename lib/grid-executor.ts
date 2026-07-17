import { GridConfig } from '@/context/GameContext';
import { BlockAction } from './blocky-blocks';

export interface GridPosition {
    x: number;
    y: number;
}

export interface ExecutionStepResult {
    position: GridPosition;
    action: BlockAction;
    hitObstacle: boolean;
    outOfBounds: boolean;
}

export interface ExecutionResult {
    steps: ExecutionStepResult[];
    finalPosition: GridPosition;
    reachedGoal: boolean;
    hitObstacle: boolean;
}

function applyAction(position: GridPosition, action: BlockAction, config: GridConfig): GridPosition {
    let { x, y } = position;

    switch (action) {
        case 'right':
            y = Math.min(config.cols, y + 1);
            break;
        case 'left':
            y = Math.max(1, y - 1);
            break;
        case 'up':
            x = Math.max(1, x - 1);
            break;
        case 'down':
            x = Math.min(config.rows, x + 1);
            break;
        case 'jump':
            y = Math.min(config.cols, y + 2);
            break;
        default:
            break;
    }

    return { x, y };
}

function isObstacle(position: GridPosition, config: GridConfig): boolean {
    return config.obstacles.some((obs) => obs.x === position.x && obs.y === position.y);
}

function isWithinBounds(position: GridPosition, config: GridConfig): boolean {
    return position.x >= 1 && position.x <= config.rows && position.y >= 1 && position.y <= config.cols;
}

export function executeActionsOnGrid(actions: BlockAction[], config: GridConfig): ExecutionResult {
    let currentPosition = { ...config.startPosition };
    const steps: ExecutionStepResult[] = [];
    let hitObstacleAnywhere = false;

    for (const action of actions) {
        const nextPosition = applyAction(currentPosition, action, config);
        const outOfBounds = !isWithinBounds(nextPosition, config);
        const hitObstacle = isObstacle(nextPosition, config);

        if (hitObstacle) hitObstacleAnywhere = true;

        currentPosition = nextPosition;
        steps.push({ position: currentPosition, action, hitObstacle, outOfBounds });
    }

    const reachedGoal =
        currentPosition.x === config.goalPosition.x &&
        currentPosition.y === config.goalPosition.y &&
        !hitObstacleAnywhere;

    return {
        steps,
        finalPosition: currentPosition,
        reachedGoal,
        hitObstacle: hitObstacleAnywhere
    };
}