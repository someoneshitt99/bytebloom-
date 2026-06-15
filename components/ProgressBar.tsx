import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  showText?: boolean;
}

export default function ProgressBar({
  progress,
  color = 'var(--primary)',
  height = 16,
  showText = false
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div style={{ width: '100%' }}>
      {showText && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontFamily: 'var(--font-kids-header)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          <span>Progres</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'var(--bg-deep)',
        borderRadius: `${height / 2}px`,
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}>
        <div
          style={{
            width: `${clampedProgress}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: `${height / 2}px`,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </div>
    </div>
  );
}
