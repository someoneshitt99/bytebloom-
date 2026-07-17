'use client';

import { useEffect, useRef, useState } from 'react';
import { GridConfig } from '@/context/GameContext';
import { ExecutionResult } from '@/lib/grid-executor';
import Bloomie from '@/components/Bloomie';

interface GridPosition {
    x: number;
    y: number;
}

interface GridSimulatorProps {
    gridConfig: GridConfig;
    executionResult: ExecutionResult | null;
    isRunning: boolean;
    onAnimationComplete: () => void;
}

export default function GridSimulator({
    gridConfig,
    executionResult,
    isRunning,
    onAnimationComplete
    }: GridSimulatorProps) {
    const [bloomiePos, setBloomiePos] = useState<GridPosition>(gridConfig.startPosition);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isRunning || !executionResult || executionResult.steps.length === 0) return;

        setBloomiePos(gridConfig.startPosition);
        setCurrentStepIdx(-1);

        let stepIdx = 0;
        const steps = executionResult.steps;

        intervalRef.current = setInterval(() => {
        if (stepIdx < steps.length) {
            setBloomiePos(steps[stepIdx].position);
            setCurrentStepIdx(stepIdx);
            stepIdx++;
        } else {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            onAnimationComplete();
        }
        }, 600);

        return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        };
    }, [isRunning, executionResult]);

    useEffect(() => {
        if (!executionResult && !isRunning) {
        setBloomiePos(gridConfig.startPosition);
        setCurrentStepIdx(-1);
        }
    }, [executionResult, isRunning, gridConfig.startPosition]);

    const currentStepHitObstacle =
        currentStepIdx >= 0 && executionResult
        ? executionResult.steps[currentStepIdx]?.hitObstacle
        : false;

    const bloomieState = isRunning
        ? currentStepHitObstacle ? 'error' : 'think'
        : !isRunning && executionResult
        ? executionResult.reachedGoal ? 'success' : 'error'
        : 'neutral';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
            💻 Visual Grid Simulator
        </span>

        <div
            style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gap: '4px',
            backgroundColor: 'var(--bg-deep)',
            border: '3px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '10px',
            width: '100%',
            position: 'relative'
            }}
        >
            {Array.from({ length: gridConfig.rows }, (_, rowIdx) =>
            Array.from({ length: gridConfig.cols }, (_, colIdx) => {
                const cellX = rowIdx + 1;
                const cellY = colIdx + 1;

                const isBloomieHere = bloomiePos.x === cellX && bloomiePos.y === cellY;
                const isObstacle = gridConfig.obstacles.some((obs) => obs.x === cellX && obs.y === cellY);
                const isGoal = gridConfig.goalPosition.x === cellX && gridConfig.goalPosition.y === cellY;
                const isPath = cellX === gridConfig.startPosition.x;

                return (
                <div
                    key={`${cellX}-${cellY}`}
                    style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    backgroundColor: isObstacle ? '#450a0a' : isPath ? '#2e1b5b' : 'transparent',
                    border: isPath && !isObstacle ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontSize: '20px'
                    }}
                >
                    {isObstacle && <span>🪨</span>}
                    {isGoal && !isBloomieHere && <span className="bounce-slow">⭐</span>}
                    {isBloomieHere && (
                    <div style={{ position: 'absolute', width: '38px', height: '38px', zIndex: 2, transition: 'all 0.5s ease' }}>
                        <Bloomie state={bloomieState} size={38} />
                    </div>
                    )}
                </div>
                );
            })
            )}
        </div>

        {executionResult && !isRunning && (
            <p style={{ fontSize: '12px', textAlign: 'center', color: executionResult.reachedGoal ? 'var(--success-light)' : 'var(--error-light)', fontFamily: 'var(--font-kids-header)', fontWeight: 'bold' }}>
            {executionResult.reachedGoal
                ? 'Bloomie berhasil mencapai bintang! ⭐'
                : executionResult.hitObstacle
                ? 'Bloomie menabrak batu! Coba susun ulang bloknya. 🪨'
                : 'Bloomie belum sampai ke bintang. Tambah lebih banyak blok! 🤔'}
            </p>
        )}
        </div>
    );
}