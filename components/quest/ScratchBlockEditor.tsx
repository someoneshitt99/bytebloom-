'use client';

import { useEffect, useRef, useState } from 'react';
import type * as BlocklyType from 'blockly';

import type { BlockAction } from '@/lib/blocky-blocks';

interface ScratchBlockEditorProps {
    onActionsChange: (actions: BlockAction[]) => void;
}

export default function ScratchBlockEditor({
    onActionsChange,
    }: ScratchBlockEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<BlocklyType.WorkspaceSvg | null>(null);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!editorRef.current) return;

        let disposed = false;

        async function initBlockly() {
        // Blockly v13
        const Blockly = await import('blockly');
        await import('blockly/blocks');
        await import('blockly/javascript');

        const En = await import('blockly/msg/en');

        const {
            GRID_MOVEMENT_BLOCKS,
            registerActionBlocks,
            buildMovementToolbox,
            extractActionsFromWorkspace,
        } = await import('@/lib/blocky-blocks');

        if (disposed) return;

        Blockly.setLocale(En.default ?? En);

        registerActionBlocks(GRID_MOVEMENT_BLOCKS);

        // Custom Theme
        const bytebloomDarkTheme = Blockly.Theme.defineTheme(
            'bytebloom-dark',
            {
            name: 'bytebloom-dark',
            base: Blockly.Themes.Classic,

            componentStyles: {
                workspaceBackgroundColour: '#0a0518',

                toolboxBackgroundColour: '#130a2a',
                toolboxForegroundColour: '#FFFFFF',

                flyoutBackgroundColour: '#1E1233',
                flyoutForegroundColour: '#CCCCCC',
                flyoutOpacity: 0.9,

                scrollbarColour: '#3D236E',
                scrollbarOpacity: 0.6,

                insertionMarkerColour: '#FFFFFF',
                insertionMarkerOpacity: 0.3,

                markerColour: '#FFFFFF',
                cursorColour: '#d0d0d0',
            },
            }
        );

        const toolbox = buildMovementToolbox(GRID_MOVEMENT_BLOCKS);

        const workspace = Blockly.inject(editorRef.current!, {
            toolbox,

            renderer: 'zelos',

            theme: bytebloomDarkTheme,

            trashcan: true,
            scrollbars: true,

            move: {
            scrollbars: true,
            drag: true,
            wheel: false,
            },

            zoom: {
            controls: false,
            wheel: false,
            startScale: 1,
            },

            grid: {
            spacing: 24,
            length: 3,
            colour: 'rgba(255,255,255,0.08)',
            snap: true,
            },
        });

        workspaceRef.current = workspace;

        workspace.addChangeListener(() => {
            const actions = extractActionsFromWorkspace(workspace);
            onActionsChange(actions);
        });

        setIsLoaded(true);
        }

        initBlockly();

        return () => {
        disposed = true;

        workspaceRef.current?.dispose();
        workspaceRef.current = null;
        };
    }, [onActionsChange]);

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
        }}
        >
        <span
            style={{
            fontSize: 11,
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
            fontWeight: 'bold',
            }}
        >
            🧩 Susun Blok Kode
        </span>

        {!isLoaded && (
            <div
            style={{
                height: 240,
                background: '#0a0518',
                border: '3px solid rgba(255,255,255,.08)',
                borderRadius: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: 13,
            }}
            >
            Memuat editor blok...
            </div>
        )}

        <div
            ref={editorRef}
            style={{
            width: '100%',
            height: 240,
            background: '#0a0518',
            border: '3px solid rgba(255,255,255,.08)',
            borderRadius: 20,
            overflow: 'hidden',
            display: isLoaded ? 'block' : 'none',
            }}
        />

        <p
            style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontFamily: 'var(--font-kids-header)',
            }}
        >
            Drag blok dari panel kiri ke area kerja untuk menyusun urutan langkah
            Bloomie.
        </p>
        </div>
    );
}