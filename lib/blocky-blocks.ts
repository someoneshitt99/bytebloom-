import * as Blockly from 'blockly/core';
import { javascriptGenerator, Order } from 'blockly/javascript';

export type BlockAction = string;

interface ActionBlockDefinition {
    type: string;
    label: string;
    action: BlockAction;
    colour: number;
}

export const GRID_MOVEMENT_BLOCKS: ActionBlockDefinition[] = [
    { type: 'bloomie_move_right', label: 'Bloomie maju kanan ➡️', action: 'right', colour: 200 },
    { type: 'bloomie_move_left', label: 'Bloomie mundur kiri ⬅️', action: 'left', colour: 200 },
    { type: 'bloomie_move_up', label: 'Bloomie naik atas ⬆️', action: 'up', colour: 200 },
    { type: 'bloomie_move_down', label: 'Bloomie turun bawah ⬇️', action: 'down', colour: 200 },
    { type: 'bloomie_jump', label: 'Bloomie melompat 🦘', action: 'jump', colour: 290 }
];

export function registerActionBlocks(blocks: ActionBlockDefinition[]) {
    for (const def of blocks) {
        Blockly.Blocks[def.type] = {
        init(this: Blockly.Block) {
            this.jsonInit({
            message0: def.label,
            previousStatement: null,
            nextStatement: null,
            colour: def.colour,
            tooltip: def.label,
            helpUrl: ''
            });
        }
        };

        javascriptGenerator.forBlock[def.type] = () => {
        return `executeAction('${def.action}');\n`;
        };
    }
}

export function buildMovementToolbox(blocks: ActionBlockDefinition[]) {
    return {
        kind: 'categoryToolbox',
        contents: [
        {
            kind: 'category',
            name: 'Gerakan',
            colour: '200',
            contents: blocks.map((def) => ({ kind: 'block', type: def.type }))
        }
        ]
    };
}

export function extractActionsFromWorkspace(workspace: Blockly.Workspace): BlockAction[] {
    const code = javascriptGenerator.workspaceToCode(workspace);
    const matches = code.matchAll(/executeAction\('([^']+)'\)/g);
    return Array.from(matches, (m) => m[1]);
}