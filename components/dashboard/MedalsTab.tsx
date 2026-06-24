interface MedalsTabProps {
    unlockedBadges: string[];
}

export default function MedalsTab({ unlockedBadges }: MedalsTabProps) {
    return (
        <div
        style={{
            flex: 1,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingBottom: '100px',
            zIndex: 10
        }}
        >
        {/* Unlocked Badges Panel */}
        <div
            style={{
            backgroundColor: '#2A1648',
            border: '2px solid #3D236E',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: 'var(--shadow-playful)'
            }}
        >
            <h3 style={{ fontSize: '18px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Medali & Pencapaian
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unlockedBadges.map((badge, idx) => (
                <div
                key={idx}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
                >
                <span style={{ fontSize: '24px' }}>🎖️</span>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{badge}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Berhasil dibuka di petualangan</div>
                </div>
                </div>
            ))}
            {unlockedBadges.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', padding: '16px' }}>
                Belum ada medali terkumpul. Selesaikan tantangan untuk mendapatkan medali!
                </p>
            )}
            </div>
        </div>
        </div>
    );
}