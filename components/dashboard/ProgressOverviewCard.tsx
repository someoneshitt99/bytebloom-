interface ProgressOverviewCardProps {
    progressPercent: number;
    completedCount: number;
    totalLessons: number;
    onOpenOutline: () => void;
}

export default function ProgressOverviewCard({
    progressPercent,
    completedCount,
    totalLessons,
    onOpenOutline
}: ProgressOverviewCardProps) {
    return (
        <div style={{ padding: '16px 16px 8px 16px', zIndex: 10 }}>
        <div
            style={{
            backgroundColor: '#2A1648',
            borderRadius: '20px',
            border: '2px solid #3D236E',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-playful)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Circular Progress Ring */}
            <div
                style={{
                position: 'relative',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: `conic-gradient(var(--accent-cyan) ${progressPercent * 3.6}deg, #3D236E 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}
            >
                <div
                style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2A1648',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-kids-header)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FFF'
                }}
                >
                {Math.round(progressPercent)}%
                </div>
            </div>

            {/* Subtitle & Title */}
            <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-kids-header)' }}>
                Progress Belajarmu
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF', fontFamily: 'var(--font-kids-header)', marginTop: '2px' }}>
                {completedCount} dari {totalLessons} Level Selesai
                </div>
            </div>
            </div>

            {/* Hamburger Menu Trigger */}
            <button
            onClick={onOpenOutline}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px'
            }}
            >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            </svg>
            </button>
        </div>
        </div>
    );
}